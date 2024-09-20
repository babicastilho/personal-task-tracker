"use client";
import React from "react";
import TodoList from "@/components/TodoList"; // Component for managing to-do tasks
import { Skeleton } from "@/components/Loading"; // Component for showing loading state
import { useProtectedPage } from "@/hooks/useProtectedPage"; // Custom hook to handle protected pages

export default function TasksPage() {
  const { isAuthenticated, loading } = useProtectedPage(); // Get authentication state using the protected page hook

  // Show loading state while authentication check is in progress
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

  // Return null if the user is not authenticated (handled by useProtectedPage)
  if (!isAuthenticated) {
    return null;
  }

  // Render the main content (To-Do List) if the user is authenticated
  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4">Your To-Do List</h2>
      <TodoList /> {/* Render the TodoList component */}
    </div>
  );
}
