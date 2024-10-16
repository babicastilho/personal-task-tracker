"use client";

import React, { useEffect } from "react";
import SignIn from "@/components/SignIn";
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
    <div className="flex flex-col items-center justify-center min-h-screen -my-24 lg:-my-20 p-4">
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
