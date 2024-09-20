"use client";

import React, { useEffect } from "react";
import SignIn from "@/components/SignIn"; // Sign-in component
import { useAuth } from "@/hooks/useAuth"; // Authentication hook
import { useRouter } from "next/navigation"; // UseRouter from next/navigation for redirection
import { Spinner } from "@/components/Loading";

export default function Home() {
  const { isAuthenticated, loading } = useAuth(); // Get authentication status and loading state from custom hook
  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect to /dashboard if the user is authenticated
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center -my-24">
      {/* Show loading screen if authentication is being verified */}
      {loading ? (
        <Spinner />
      ) : (
        // Conditionally render SignIn form (Dashboard redirection is handled in useEffect)
        !isAuthenticated && <SignIn />
      )}
    </div>
  );
}
