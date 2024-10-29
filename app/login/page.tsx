/**
 * LoginPage.tsx
 * 
 * Client-side rendered login page that checks authentication state, manages redirection,
 * and conditionally displays messages based on URL parameters.
 * 
 * Features:
 * - Uses `useAuth` hook to verify if the user is already authenticated.
 * - Redirects authenticated users to the specified URL or defaults to `/dashboard`.
 * - Displays context-specific messages (e.g., session expired, login required) based on query parameters.
 * - Renders the `SignIn` component for user login.
 * 
 * @param message - Query parameter to display relevant login messages (e.g., "session_expired").
 * @param redirectUrl - Optional query parameter for redirection upon login.
 */

"use client";

import React, { useEffect } from "react";
import SignIn from "@/components/auth/SignIn";
import { useRouter, useSearchParams } from "next/navigation"; // Import necessary hooks
import { useAuth } from "@/hooks/useAuth"; // Import custom authentication hook
import { Spinner } from "@/components/Loading"; // Import Spinner component

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth(); // Access authentication status
  const router = useRouter();
  const searchParams = useSearchParams(); // Access URL search parameters

  const message = searchParams.get("message"); // Retrieve the 'message' parameter
  const redirectUrl = searchParams.get("redirect") || "/dashboard"; // Get the redirect URL or default to dashboard

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, loading, router, redirectUrl]);

  return (
    <div className={`flex flex-col items-center justify-center ${isAuthenticated ? '' : 'lg:ml-0'} min-h-screen`}>
      {/* Display a loading spinner while checking authentication */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Conditionally display messages based on the 'message' query param */}
          {message === "session_expired" && (
            <p className="text-red-500 mb-4">
              Your session has expired. Please log in again.
            </p>
          )}
          {message === "login_required" && (
            <p className="text-blue-500 mb-4">
              Your session has expired. Please log in again to continue.
            </p>
          )}
          {message === "no_token" && (
            <p className="text-blue-500 mb-4">
              You need to log in to continue.
            </p>
          )}
          {message === "logout_successful" && (
            <p className="text-center text-green-500 mb-4">
              <span>Logout successful.</span>
              <span className="block">Please log in again to continue.</span>
            </p>
          )}

          {/* Render the sign-in form */}
          <SignIn />
        </>
      )}
    </div>
  );
}
