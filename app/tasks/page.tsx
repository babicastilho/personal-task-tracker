"use client"; // Garantir que o código seja executado no client-side
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use the next/navigation router for client-side routing
import TodoList from "@/components/tasks/TodoList";
import { Skeleton } from "@/components/loading";
import { useProtectedPage } from "@/hooks/useProtectedPage";

export default function TasksPage() {
  const { isAuthenticated, loading } = useProtectedPage();
  const router = useRouter(); // useRouter to manage routing

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isAuthenticated && !loading) {
        // Check if authentication failed due to an expired token
        try {
          const response = await fetch("/api/auth/check"); // Validate the token
          const data = await response.json();
  
          if (!response.ok && data.message === "Token expired") {
            // If the token has expired, redirect with a session expired message
            router.push("/login?message=session_expired");
          } else {
            // Otherwise, redirect with the default no_token message
            router.push("/login?message=no_token");
          }
        } catch (error) {
          // If there's an error checking the token, redirect with no_token message
          router.push("/login?message=no_token");
        }
      }
    };
  
    handleAuthentication();
  }, [isAuthenticated, loading, router]);
  

  // Show loading state while authentication check is in progress
  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Skeleton
          repeatCount={3} // Number of skeleton groups
          count={2} // Number of skeletons per group
          type="text" // Text type skeleton
          widths={["w-full", "w-3/4"]}
          skeletonDuration={1000} // Skeleton animation duration
        />
      </div>
    );
  }

  // Render null if authentication fails (handled by useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Render the main content if the user is authenticated
  return (
    <div className="mt-16 p-8 dark:text-gray-300">
      {/* Passing router functions to the TodoList component */}
      <TodoList
        onAddTask={() => router.push("/tasks/new")} // Navigate to add task page
        onEditTask={(id) => router.push(`/tasks/edit/${id}`)} // Navigate to edit task page
      />
    </div>
  );
}
