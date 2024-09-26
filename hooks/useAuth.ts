//
/**
 * hooks/useAuth.ts
 * Custom hook to manage user authentication state.
 * 
 * Checks if the user is authenticated by validating the token with the API.
 * Tracks authentication status, loading state, and any authentication errors.
 * 
 * @returns An object with isAuthenticated, loading, and authError states.
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
