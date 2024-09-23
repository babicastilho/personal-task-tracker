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
  const token = window.localStorage.getItem('token'); // Using localStorage for the token

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

    // If the token is expired or invalid, redirect using the centralized function
    if (response.status === 401) {
      handleAuthRedirection("token_expired", window); // Use the function to manage redirection
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
