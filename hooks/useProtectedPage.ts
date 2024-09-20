import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to handle protected page redirection based on authentication status.
 */
export const useProtectedPage = () => {
  const { isAuthenticated, loading, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authError === 'token_expired') {
        // Redirect to login with session_expired message if token is expired
        router.replace('/login?message=session_expired');
      } else if (authError === 'no_token') {
        // Redirect to login with a message that login is required
        router.replace('/login?message=login_required');
      }
    }
  }, [loading, authError, router]);

  return { isAuthenticated, loading };
};
