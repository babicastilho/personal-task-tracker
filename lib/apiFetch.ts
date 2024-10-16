// lib/apiFetch.ts
import { handleAuthRedirection } from '@/lib/redirection';
import { getToken } from '@/lib/tokenUtils'; // Import getToken to centralize token retrieval

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken(); // Use centralized getToken from tokenUtils

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Token:', token); // Log the token for debugging purposes
  }

  console.log('URL:', url); // Log the URL to debug
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

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
