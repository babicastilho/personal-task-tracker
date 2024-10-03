"use client"; // Garantir que o código seja executado no client-side
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use the next/navigation router for client-side routing
import TodoList from "@/components/TodoList";
import { Skeleton } from "@/components/Loading";
import { useProtectedPage } from "@/hooks/useProtectedPage";

export default function TasksPage() {
  const { isAuthenticated, loading } = useProtectedPage();
  const router = useRouter(); // useRouter to manage routing

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login"); // Redirect to login if the user is not authenticated
    }
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
    <div className="p-4 dark:text-gray-300">
      {/* Passing router functions to the TodoList component */}
      <TodoList
        onAddTask={() => router.push("/tasks/new")} // Navigate to add task page
        onEditTask={(id) => router.push(`/tasks/edit/${id}`)} // Navigate to edit task page
      />
    </div>
  );
}
