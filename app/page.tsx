"use client";

import React from "react";
import Dashboard from "@/components/Dashboard"; // Your dashboard component
import SignIn from "@/components/SignIn"; // Your sign-in component
import { useAuth } from "@/hooks/useAuth"; // Use the authentication hook

export default function Home() {
  const { isAuthenticated, loading } = useAuth(); // Get auth status from the custom hook

  // Show loading state during authentication check
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading...</p>
      </main>
    );
  }

  // Render the dashboard if authenticated, otherwise render the sign-in form
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isAuthenticated ? <Dashboard /> : <SignIn />} {/* Conditional rendering based on authentication */}
    </main>
  );
}
