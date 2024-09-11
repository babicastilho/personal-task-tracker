// apiFetch.ts

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

  // Garantir que o cabeçalho seja do tipo correto e inclua Authorization
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Se houver um token, adiciona o cabeçalho Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configurar as opções da requisição, incluindo os headers
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
