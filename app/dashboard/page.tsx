/**
 * DashboardPage.tsx
 * 
 * Client-side rendered page component for the user dashboard. Uses `useProtectedPage` to 
 * manage authentication state and conditionally render content.
 * 
 * Features:
 * - Displays a loading skeleton while verifying authentication.
 * - Renders the Dashboard component if the user is authenticated.
 * - Redirects to the login page if the user is not authenticated.
 * 
 */

"use client";

import React from "react";
import { useProtectedPage } from "@/hooks/useProtectedPage"; // Custom hook for protected pages
import Dashboard from "@/components/dashboard"; // Import the dashboard component
import { Skeleton } from "@/components/Loading"; // Import Skeleton component for loading state

export default function DashboardPage() {
  const { isAuthenticated, loading } = useProtectedPage(); // Use the new useProtectedPage hook

  // Display skeleton while authentication is being verified
  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Skeleton
          repeatCount={3} // Number of times to repeat the skeleton set
          count={2} // Number of skeletons in the set
          type="text" // Type of skeleton (text-based in this case)
          widths={["w-full", "w-3/4"]} // Widths for each skeleton
          skeletonDuration={1000} // Duration of the skeleton before showing actual content
        />
      </div>
    );
  }

  // If the user is authenticated, render the dashboard
  if (isAuthenticated) {
    return (
      <div className="mt-4 p-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <Dashboard /> {/* Render the Dashboard component */}
      </div>
    );
  }

  // Return null if redirection is in progress
  return null;
}
