// lib/tokenUtils.ts
import { apiFetch } from '@/lib/apiFetch';

export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');

// Example function to verify token with API
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
