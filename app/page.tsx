"use client";

import React from "react";
import Dashboard from "@/components/Dashboard"; // Dashboard component
import SignIn from "@/components/SignIn"; // Sign-in component
import { useAuth } from "@/hooks/useAuth"; // Authentication hook

export default function Home() {
  const { isAuthenticated, loading } = useAuth(); // Get authentication status and loading state from custom hook

  return (
    <div className="flex min-h-screen flex-col items-center justify-center -my-24">
      {/* Show loading screen if authentication is being verified */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        // Conditionally render Dashboard if authenticated, otherwise render SignIn form
        isAuthenticated ? <Dashboard /> : <SignIn />
      )}
    </div>
  );
}
