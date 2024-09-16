"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch"; // Using apiFetch function to handle requests
import { Skeleton } from "@/components/Loading"; // Skeleton component for loading state

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const TodoListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store the tasks
  const [newTask, setNewTask] = useState(""); // State for new task input
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to show error messages

  // useEffect to load tasks when the component is mounted
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiFetch("/api/tasks", {
          method: "GET",
        });
        if (data && data.success) {
          setTasks(data.tasks); // Set tasks in the state
        } else {
          setErrorMessage("Failed to fetch tasks."); // Show error message if fetch fails
        }
      } catch (error) {
        console.error("Error fetching tasks:", error); // Log any errors
        setErrorMessage("Failed to load tasks. Please try again."); // Show a generic error message
      } finally {
        setLoading(false); // Stop loading once tasks are fetched
      }
    };

    fetchTasks(); // Trigger fetching of tasks
  }, []);

  // Function to add a new task
  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const data = await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify({
            title: newTask, // Send new task title
            completed: false,
          }),
        });
        if (data && data.success) {
          setTasks([...tasks, data.task]); // Add the new task to the list
          setNewTask(""); // Clear the input field after adding the task
        } else {
          setErrorMessage("Failed to add task."); // Show error if task addition fails
        }
      } catch (error) {
        console.error("Error adding task:", error); // Log any errors
        setErrorMessage("Error adding task. Please try again."); // Show a generic error message
      }
    }
  };

  // Function to delete a task
  const deleteTask = async (id: string) => {
    try {
      const data = await apiFetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (data && data.success) {
        setTasks(tasks.filter((task) => task._id !== id)); // Remove the task from the list
      } else {
        setErrorMessage("Failed to delete task."); // Show error if task deletion fails
      }
    } catch (error) {
      console.error("Error deleting task:", error); // Log any errors
      setErrorMessage("Error deleting task. Please try again."); // Show a generic error message
    }
  };

  // Render the loading state
  if (loading) {
    return (
      <Skeleton
        data-testid="skeleton-loader" // Identifier for tests
        repeatCount={4} // Number of times to repeat the skeleton set
        count={5} // Number of skeletons in the set
        type="text" // Type of skeleton
        widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]} // Widths of each skeleton
        skeletonDuration={1000} // Duration before showing real content
      />
    );
  }

  // Render an error message if there is one
  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4" data-cy="categories-header">Categories</h2>

      {/* Form to add a new task */}
      <div className="mb-4" data-cy="task-form">
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)} // Update new task state when input changes
        />
        <button
          onClick={addTask}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* List of tasks */}
      <ul className="list-disc space-y-2 pl-5" data-cy="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center">
            <span data-cy={`task-${task.title}`}>{task.title}</span>
            <button
              onClick={() => deleteTask(task._id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListPage;
