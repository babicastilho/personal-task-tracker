//
// lib/apiFetch.ts
/**
 * Provides a centralized function to handle authenticated API requests.
 * 
 * The `apiFetch` function manages HTTP requests with JSON handling, token-based authentication, 
 * and redirects upon token expiration. It integrates `getToken` for token retrieval and `handleAuthRedirection`
 * for handling authentication errors, ensuring consistent API interactions across the app.
 * 
 * @param url - The endpoint URL for the API request.
 * @param options - Additional options for the fetch request (method, headers, etc.).
 * @returns JSON response if the request is successful; otherwise, throws an error or redirects if unauthorized.
 */

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
