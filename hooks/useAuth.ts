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
import { apiFetch } from '@/lib/apiFetch'; // Import the apiFetch function

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is authenticated
  const [loading, setLoading] = useState(true); // Track loading state
  const [authError, setAuthError] = useState<string | null>(null); // Track authentication errors
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the auth token from localStorage
        const token = window.localStorage.getItem('token'); 

        // If no token is found, set authError to 'no_token'
        if (!token) {
          setIsAuthenticated(false);
          setAuthError("no_token"); 
          return;
        }

        // Check the token with the API
        const response = await apiFetch('/api/auth/check', { method: 'GET' });

        // If valid, set isAuthenticated to true
        if (response && response.success) {
          setIsAuthenticated(true);
        } else {
          // If invalid, clear localStorage and set authError to 'token_expired'
          window.localStorage.removeItem('token'); 
          setIsAuthenticated(false);
          setAuthError("token_expired"); 
        }
      } catch (error) {
        // On any error, mark authentication as failed
        setIsAuthenticated(false);
        setAuthError("auth_failed");
      } finally {
        setLoading(false); // Stop loading after the check
      }
    };

    checkAuth();
  }, [authError, router]);

  return { isAuthenticated, loading, authError };
};
