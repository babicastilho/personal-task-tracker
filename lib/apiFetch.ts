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

    // If the token is invalid or expired, redirect to login page with message
    if (response.status === 401) {
      window.location.href = '/login?message=session_expired'; // Redirect to login with expired session message
      return null;
    }

    // If response is not OK, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    // Log any errors encountered during the fetch
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
