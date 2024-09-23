// 
/**
 * hooks/useProtectedPage.ts
 * 
 * Hook to handle redirection on protected pages based on authentication state.
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
    if (!loading) {
      console.log('Auth error in useProtectedPage:', authError); // Log para verificar o erro de autenticação
      handleAuthRedirection(authError, router); 
    }
  }, [loading, authError, router]);

  return { isAuthenticated, loading };
};
