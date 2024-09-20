// lib/apiFetch.ts

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  // Get the authToken from cookies
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('authToken='))
    ?.split('=')[1];

  // Initialize the headers with Content-Type
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If a token is available, add Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Combine custom headers with any provided options
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  try {
    // Perform the API request
    const response = await fetch(url, fetchOptions);

    // Handle unauthorized response
    if (response.status === 401) {
      const path = window.location.pathname;

      // Only redirect to /login?message=session_expired if it's a protected route
      if (!['/', '/login'].includes(path) && !path.startsWith('/public')) {
        // Ensure only token expiration or unauthorized access triggers the message
        window.location.href = '/login?message=session_expired';
      } else {
        // If not a protected route, just redirect to login without the message
        window.location.href = '/login';
      }
      return null;
    }

    // If response is not OK, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
