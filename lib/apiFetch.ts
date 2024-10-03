//
/**
 * lib/apiFetch.ts
 * Utility function to perform authenticated API requests.
 * 
 * Retrieves the token from localStorage and includes it in the request headers.
 * Handles authentication errors like token expiration and redirects if necessary.
 * 
 * @param url - The API endpoint URL.
 * @param options - Request options, such as method, headers, and body.
 * @returns A promise resolving to the API response, or null if authentication fails.
 * @throws Will throw an error if the request fails or the response is not OK.
 */

import { handleAuthRedirection } from '@/lib/redirection';

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = window.localStorage.getItem('token'); // Retrieve the token from localStorage

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Include the token in the Authorization header
    console.log('Token:', token); // Log the token for debugging purposes
  }

  console.log('URL:', url); // Log the URL to debug

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}), // Spread headers from options if any
    },
  };

  console.log('URL:', url); // Verificar a URL
  console.log('Headers:', fetchOptions.headers); // Verificar os headers
  console.log('Body:', fetchOptions.body); // Verificar o corpo da requisição

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      handleAuthRedirection("token_expired", window); 
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

