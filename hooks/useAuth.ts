import { useState, useEffect } from 'react';
import { checkAuth, logout } from '@/lib/auth';

/**
 * Hook for managing authentication state across the app.
 * It verifies the authentication status and provides functions to logout.
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Runs once when the component using the hook is mounted
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated); // Set the auth state
      } catch (error) {
        console.error('Failed to check authentication:', error);
      } finally {
        setLoading(false); // Stop loading after verification
      }
    };

    verifyAuth(); // Call the authentication check function
  }, []);

  // Return the authentication state, loading state, and logout function
  return { isAuthenticated, loading, logout };
};
