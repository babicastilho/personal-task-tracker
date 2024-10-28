// app/tasks/edit/[id]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter from next/navigation
import TaskForm from "@/components/tasks/TaskForm";
import { apiFetch } from "@/lib/apiFetch";
import { Spinner } from "@/components/loading";

export default function EditTaskPage() {
  const { id } = useParams(); // Get the task ID from dynamic route params
  const router = useRouter(); // Get router for redirection after saving/deleting
  const [task, setTask] = useState(null); // State to hold the fetched task data

  // Fetch the task data when the task ID changes
  useEffect(() => {
    if (id) {
      // Fetch task data using the provided ID
      apiFetch(`/api/tasks/${id}`).then((response) => {
        if (response.success) {
          setTask(response.task); // Set the task data to state
        } else {
          console.error("Failed to load task");
        }
      });
    }
  }, [id]);

  // Display a loading message while the task data is being fetched
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -my-24">
        <Spinner />
      </div>
    );
  }

  // Render the form with the loaded task data
  return <TaskForm task={task} />;
}
