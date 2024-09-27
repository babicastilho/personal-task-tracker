"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { FaRegTrashAlt, FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { Skeleton } from "@/components/Loading";

// Define the Task and Category interfaces
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low"; // Add priority to Task interface
  dueDate?: string | undefined; // Optional due date for tasks
  dueTime?: string | undefined; // Optional due time for tasks
  categoryId?: string; // Optional categoryId for tasks
}

interface Category {
  _id: string;
  name: string;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // List of tasks
  const [newTask, setNewTask] = useState<string>(""); // New task state
  const [dateInput, setDateInput] = useState<string>(""); // New due date state
  const [timeInput, setTimeInput] = useState<string>(""); // New due time state
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  ); // Selected category
  const [priority, setPriority] = useState<string>("medium"); // Add state for task priority

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch tasks and categories on component mount
  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        // Fetch tasks
        const taskData = await apiFetch("/api/tasks", { method: "GET" });
        if (taskData && taskData.success) {
          console.log("Loaded tasks with dueDate and dueTime:", taskData.tasks); // Log loaded tasks
          setTasks(taskData.tasks);
        } else {
          setErrorMessage("Failed to fetch tasks.");
        }

        // Fetch categories
        const categoryData = await apiFetch("/api/categories", {
          method: "GET",
        });
        if (categoryData && categoryData.success) {
          setCategories(categoryData.categories);
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching tasks and categories:", error);
        setErrorMessage(
          "Failed to load tasks or categories. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndCategories();
  }, []);

  // Add new task
  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        // Prepare task payload, only sending dueDate and dueTime if they are filled
        const taskPayload: any = {
          title: newTask,
          categoryId: selectedCategoryId,
          completed: false,
          priority,
          dueDate: dateInput || undefined, // Send due date only if filled
          dueTime: timeInput || undefined, // Send due time only if filled
        };

        console.log("Task payload being sent:", taskPayload); // Log task payload being sent

        const data = await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify(taskPayload),
        });

        if (data && data.success) {
          console.log("Task added successfully:", data.task); // Log added task
          setTasks([...tasks, data.task]); // Update the task list with the new task
          setNewTask("");
          setSelectedCategoryId(null);
          setPriority("medium");
          setDateInput(""); // Reset date after adding
          setTimeInput(""); // Reset time after adding
        } else {
          setErrorMessage("Failed to add task.");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        setErrorMessage("Error adding task. Please try again.");
      }
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((task) => task._id === id);
    if (task) {
      try {
        const data = await apiFetch(`/api/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            completed: !task.completed,
            priority: task.priority, // Keep the priority while updating
            dueDate: task.dueDate, // Keep the due date while updating
            dueTime: task.dueTime, // Keep the due time while updating
          }),
        });
        if (data && data.success) {
          setTasks(tasks.map((t) => (t._id === id ? data.task : t))); // Update task in the list
        } else {
          setErrorMessage("Failed to toggle task completion.");
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
        setErrorMessage("Error toggling task completion. Please try again.");
      }
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const data = await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (data && data.success) {
        setTasks(tasks.filter((task) => task._id !== id)); // Remove task from the list
      } else {
        setErrorMessage("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Error deleting task. Please try again.");
    }
  };

  // Check if the task is overdue
  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    return currentDate > taskDueDate;
  };

  if (loading) {
    return (
      <Skeleton
        repeatCount={4}
        count={5}
        type="text"
        widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]}
      />
    );
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <div data-cy="todo-list" className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 mr-2"
          data-cy="task-input"
        />

        {/* Category Selection */}
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value || null)}
          className="border p-2 mr-2"
          data-cy="category-select"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Priority Selection */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 mr-2"
          data-cy="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* Due Date Input */}
        <input
          type="date"
          value={dateInput || ""} // Send "" if not filled
          onChange={(e) => setDateInput(e.target.value)} // This should update dateInput
          className="border p-2 mr-2"
          data-cy="date-input"
        />

        {/* Due Time Input */}
        <input
          type="time"
          value={timeInput || ""} // Send "" if not filled
          onChange={(e) => setTimeInput(e.target.value)} // This should update timeInput
          className="border p-2 mr-2"
          data-cy="time-input"
        />

        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* List of tasks */}
      <ul className="list-disc space-y-2 pl-5" data-cy="task-list">
        {tasks.map((task) => {
          console.log("Task data:", task.dueDate, task.dueTime); // Log task dueDate and dueTime for debugging

          return (
            <li
              key={task._id}
              className={`flex justify-between items-center ${
                task.completed ? "text-gray-400" : "text-black"
              } ${isTaskOverdue(task.dueDate) ? "text-red-500" : ""}`} // Highlight overdue tasks in red
            >
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
                data-cy={`task-${task.title}`}
              >
                {task.title} -{" "}
                {task.priority
                  ? `${
                      task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)
                    } Priority`
                  : "Medium Priority"}
              </span>

              {task.dueDate && (
                <span className="text-sm">
                  - Due Date:{" "}
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {task.dueTime && (
                    <>
                      {" "}
                      at {task.dueTime} {/* Exibir o horário após a data */}
                    </>
                  )}
                </span>
              )}

              <div>
                {/* Toggle task completion */}
                <button
                  onClick={() => toggleTaskCompletion(task._id)}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
                  aria-label={`toggle-${task._id}`}
                  data-cy={`toggle-task-${task._id}`}
                >
                  {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
                </button>

                {/* Delete task */}
                <button
                  onClick={() => deleteTask(task._id)}
                  className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
                  aria-label={`remove-${task._id}`}
                  data-cy={`remove-task-${task._id}`}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;
