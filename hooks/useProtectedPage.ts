// 
/**
 * hooks/useProtectedPage.ts
 * Hook to manage access to protected pages by redirecting unauthenticated users.
 * 
 * Utilizes the `useAuth` hook to determine the user's authentication state and triggers a redirection 
 * to the login page with an appropriate message if the user is not authenticated.
 * 
 * @returns An object containing `isAuthenticated` (boolean) and `loading` (boolean) to indicate 
 *          authentication status and loading state.
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
