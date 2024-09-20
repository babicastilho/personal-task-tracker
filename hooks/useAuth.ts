import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiFetch'; // Import the apiFetch function

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
  const [loading, setLoading] = useState(true); // State to track if authentication check is still loading
  const [authError, setAuthError] = useState<string | null>(null); // State to track if there's an authentication error
  const router = useRouter(); // Next.js router for handling navigation

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the auth token from localStorage
        const token = window.localStorage.getItem('token');

        // If no token is found, mark as not authenticated but without an error
        if (!token) {
          setIsAuthenticated(false);
          setAuthError("no_token"); // This means no token exists (attempt to access directly)
          return;
        }

        // Call the API to check if the token is valid
        const response = await apiFetch('/api/auth/check', { method: 'GET' });

        // If the API response indicates success, set the user as authenticated
        if (response && response.success) {
          setIsAuthenticated(true);
        } else {
          // If the token is invalid or expired, clear the token and set the error to "token_expired"
          window.localStorage.removeItem('token');
          setIsAuthenticated(false);
          setAuthError("token_expired"); // Token has expired
        }
      } catch (error) {
        // Any other error, consider the user unauthenticated and set a generic error
        setIsAuthenticated(false);
        setAuthError("auth_failed");
      } finally {
        setLoading(false); // Stop the loading spinner after check
      }
    };

    // Run authentication check when the component mounts
    checkAuth();
  }, [router]);

  return { isAuthenticated, loading, authError };
};
