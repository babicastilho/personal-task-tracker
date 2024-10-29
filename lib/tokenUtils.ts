// 
/**
 * lib/tokenUtils.ts
 * Utility functions for managing and verifying JWT tokens in the application.
 * 
 * Provides helper functions to retrieve and clear tokens from local storage, and to verify tokens by calling 
 * the API for validation. These functions assist in handling authentication state and user sessions.
 * 
 * @returns - Various types depending on the function: token string, boolean success, or error status.
 */

import { apiFetch } from '@/lib/apiFetch';

export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');

// Function to verify token with API
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
