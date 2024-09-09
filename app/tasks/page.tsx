"use client";
import React, { useState, useEffect } from "react";
import TodoList from "@/components/TodoList";
import { checkAuth } from "@/lib/auth"; // Import authentication function
import { Skeleton } from "@/components/Loading";

export default function TasksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Failed to check authentication:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento após verificar a autenticação
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Skeleton
          repeatCount={3} // Number of times to repeat the entire set
          count={2} // Number of skeletons inside the set
          type="text" // Skeleton type
          widths={["w-full", "w-3/4"]} // Widths for each skeleton
          skeletonDuration={1000} // Delay before showing real content
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <p>Please sign in to view your tasks.</p>;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4">Your To-Do List</h2>
        <TodoList />{" "}
        {/* This component is responsible for displaying and managing tasks */}
      </div>
    </div>
  );
}
