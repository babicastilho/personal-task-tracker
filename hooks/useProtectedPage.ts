//
/**
 * hooks/useProtectedPage.ts
 * Hook to handle redirection on protected pages based on authentication state.
 * 
 * Redirects the user to the login page with appropriate messages if authentication fails.
 * @returns An object containing the authentication state (isAuthenticated) and loading status.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { handleAuthRedirection } from '@/lib/redirection';

export const useProtectedPage = () => {
  const { isAuthenticated, loading, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Log the current authentication state and loading status
    console.log('Protected page check - isAuthenticated:', isAuthenticated, 'loading:', loading);

    // If authentication check is done, handle redirection if not authenticated
    if (!loading) {
      if (!isAuthenticated) {
        console.log('User not authenticated, triggering redirection');
        handleAuthRedirection(authError, router);
      }
    }
  }, [loading, isAuthenticated, authError, router]);

  return { isAuthenticated, loading };
};
