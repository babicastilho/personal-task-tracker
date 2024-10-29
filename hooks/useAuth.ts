// 
/**
 * hooks/useAuth.ts
 * Custom hook to manage user authentication state.
 * 
 * This hook checks if the user is authenticated by validating the token with the API.
 * It tracks the authentication status (`isAuthenticated`), loading state, and any authentication errors.
 * If authentication fails, it updates the error state accordingly.
 * 
 * @returns An object containing `isAuthenticated` (boolean), `loading` (boolean), and `authError` (string or null).
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTokenWithAPI } from '@/lib/tokenUtils'; // Import the new utility function

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { valid, error } = await verifyTokenWithAPI(); // Call the centralized function
      setIsAuthenticated(valid);
      setAuthError(error);
      setLoading(false);
    };

    checkAuth();
  }, [authError, router]);

  return { isAuthenticated, loading, authError };
};
