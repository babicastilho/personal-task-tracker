// lib/tokenUtils.ts
export const getToken = () => localStorage.getItem('token');

export const clearToken = () => localStorage.removeItem('token');

// Centralize a chamada para a API de verificação de token
export const verifyTokenWithAPI = async () => {
  const token = getToken();
  if (!token) return { valid: false, error: 'no_token' };

  try {
    const response = await apiFetch('/api/auth/check');
    if (response && response.success) {
      return { valid: true, error: null };
    } else {
      clearToken();
      return { valid: false, error: 'token_expired' };
    }
  } catch (error) {
    return { valid: false, error: 'auth_failed' };
  }
};
