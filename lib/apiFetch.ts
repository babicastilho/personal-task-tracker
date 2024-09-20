/**
 * lib/apiFetch.ts
 * 
 * Performs an API request and handles authentication errors, including token expiration.
 * @param url - The API endpoint URL.
 * @param options - Request options, such as method, headers, and body.
 * @returns A promise resolving to the API response, or null if authentication fails.
 * @throws Will throw an error if the request fails or the response is not OK.
 */

import { handleAuthRedirection } from '@/lib/redirection';

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = window.localStorage.getItem('token'); // Usando localStorage para o token

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Se o token estiver expirado ou inválido, redireciona usando a função centralizada
    if (response.status === 401) {
      handleAuthRedirection("token_expired", window); // Usa a função para gerenciar o redirecionamento
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
