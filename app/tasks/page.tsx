// tasks.tsx

"use client";
import React, { useState, useEffect } from "react";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/hooks/useAuth"; // Custom hook to manage authentication state
import { Skeleton } from "@/components/Loading"; // Import Skeleton component for loading state

export default function TasksPage() {
  const { isAuthenticated, loading } = useAuth(); // Use the custom hook to check authentication state

  // Render the loading state while authentication check is in progress
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

  // If the user is not authenticated, show a sign-in message
  if (!isAuthenticated) {
    return <p>Please sign in to view your tasks.</p>;
  }

  // Render the main content (To-Do List) if the user is authenticated
  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4">Your To-Do List</h2>
      <TodoList /> {/* Render the TodoList component */}
    </div>
  );
}
