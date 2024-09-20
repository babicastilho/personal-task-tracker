"use client";

import React, { useEffect } from 'react';
import SignIn from '@/components/SignIn'; // Reusing the existing SignIn component
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { useAuth } from '@/hooks/useAuth'; // Import the authentication hook
import { Spinner } from '@/components/Loading';

/**
 * Login page that renders the SignIn component.
 * It also displays session expiration message if the session has expired.
 */
export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  const { message } = searchParams; // Capture the query parameter from Next.js 13+ "searchParams" prop
  const { isAuthenticated, loading } = useAuth(); // Get authentication status and loading state
  const router = useRouter(); // Initialize useRouter for redirection

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // If authenticated and not loading, redirect to /dashboard
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -my-24 lg:-my-20 p-4">
      {/* Display loading message while authentication is being verified */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Display session expired message if the query parameter is set */}
          {message === 'session_expired' && (
            <p className="text-red-500 mb-4">Your session has expired. Please log in again.</p>
          )}

          {/* Display login required message if the query parameter is set */}
          {message === 'login_required' && (
            <p className="text-blue-500 mb-4">You need to log in to continue.</p>
          )}

          <SignIn /> {/* Render the sign-in form if not authenticated */}
        </>
      )}
    </div>
  );
}
