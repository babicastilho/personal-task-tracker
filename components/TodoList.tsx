"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { FaRegCheckSquare, FaRegSquare, FaPen } from "react-icons/fa";
import { Skeleton } from "@/components/Loading";
import { formatForDataCy } from "@/lib/utils";

// Define interfaces for Task and Category
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string | undefined;
  dueTime?: string | undefined;
  categoryId?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface TodoListProps {
  onAddTask: () => void; // Prop to handle task creation
  onEditTask: (id: string) => void; // Prop to handle task editing
}

const TodoList: React.FC<TodoListProps> = ({ onAddTask, onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  // Fetch tasks and categories when the component mounts
  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        const taskData = await apiFetch("/api/tasks", { method: "GET" });
        if (taskData && taskData.success) {
          setTasks(taskData.tasks); // Set tasks if the API response is successful
        } else {
          setErrorMessage("Failed to fetch tasks.");
        }

        const categoryData = await apiFetch("/api/categories", {
          method: "GET",
        });
        if (categoryData && categoryData.success) {
          setCategories(categoryData.categories); // Set categories if the API response is successful
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching tasks and categories:", error);
        setErrorMessage(
          "Failed to load tasks or categories. Please try again."
        );
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTasksAndCategories(); // Call the fetch function
  }, []);

  // Function to toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((task) => task._id === id);
    if (task) {
      try {
        const data = await apiFetch(`/api/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            completed: !task.completed, // Toggle completion state
            priority: task.priority,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
          }),
        });
        if (data && data.success) {
          setTasks(
            (prevTasks) => prevTasks.map((t) => (t._id === id ? data.task : t)) // Update tasks state
          );
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }
  };

  // Check if the task is overdue
  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    return currentDate > taskDueDate; // Compare current date with task's due date
  };

  if (loading) {
    return (
      <Skeleton
        repeatCount={4} // Number of skeletons to display
        count={5}
        type="text" // Text type skeletons
        widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]}
      />
    );
  }

  return (
    <div data-cy="todo-list" data-testid="todo-list" className="px-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Your To-Do List</h1>
        {/* Button to trigger task creation */}
        <button
          onClick={onAddTask}
          className="bg-blue-500 text-white p-2 rounded"
          data-testid="button-add-task"
          data-cy="button-add-task"
        >
          Add New Task
        </button>
      </div>

      {/* Show error message if there is any */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {tasks.map((task) => {
          const dueDate = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"; // Format due date
          const category = categories.find(
            (cat) => cat._id === task.categoryId
          ); // Find the category

          return (
            <div
              key={task._id}
              className={`flex flex-col justify-between p-4 border rounded-md shadow-md transition-all ${
                isTaskOverdue(task.dueDate) && !task.completed
                  ? "border-red-500"
                  : "border-gray-200"
              } ${
                task.completed
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  : "bg-white dark:bg-gray-800"
              }`}
              data-cy={`task-${formatForDataCy(task.title)}`}
              data-testid={`task-${formatForDataCy(task.title)}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`font-semibold ${
                    task.completed ? "line-through" : ""
                  }`}
                  data-testid={`task-title-${task._id}`}
                  data-cy={`task-title-${task._id}`}
                >
                  {task.title} {/* Task title */}
                </span>
                <button
                  onClick={() => toggleTaskCompletion(task._id)} // Toggle task completion
                  className="text-blue-500 mt-2"
                  aria-label={`toggle-${task._id}`}
                  data-cy={`todo-edit-${formatForDataCy}`} 
                  data-testid={`todo-edit-${formatForDataCy}`}
                >
                  {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
                </button>
              </div>

              <div className="my-3 text-sm text-gray-500">
                <p>Category: {category ? category.name : "No category"}</p>
                <p>
                  Priority:{" "}
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </p>
                <p
                  className={`text-sm ${
                    isTaskOverdue(task.dueDate) && !task.completed
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  Due Date:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>

              <div className="mt-2">
                {/* Button to trigger task editing */}
                <button
                  onClick={() => onEditTask(task._id)} // Call edit function
                  className="transition-all bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-400"
                  aria-label={`edit-${task._id}`}
                  data-cy={`edit-task-${formatForDataCy(task.title)}`}
                  data-testid={`edit-task-${formatForDataCy(task.title)}`}
                >
                  <FaPen />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoList;
