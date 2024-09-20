"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { FaRegTrashAlt, FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { Skeleton } from "@/components/Loading"; // Skeleton component for loading state

// Define the Task and Category interfaces
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface Category {
  _id: string;
  name: string;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>(""); // New task state
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // Selected category

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        // Fetch tasks
        const taskData = await apiFetch("/api/tasks", { method: "GET" });
        if (taskData && taskData.success) {
          setTasks(taskData.tasks);
        } else {
          setErrorMessage("Failed to fetch tasks.");
        }

        // Fetch categories
        const categoryData = await apiFetch("/api/categories", { method: "GET" });
        if (categoryData && categoryData.success) {
          setCategories(categoryData.categories);
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching tasks and categories:", error);
        setErrorMessage("Failed to load tasks or categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndCategories();
  }, []);

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const data = await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify({
            title: newTask,
            categoryId: selectedCategoryId,
            completed: false,
          }),
        });
        if (data && data.success) {
          setTasks([...tasks, data.task]);
          setNewTask("");
        } else {
          setErrorMessage("Failed to add task.");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        setErrorMessage("Error adding task. Please try again.");
      }
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(task => task._id === id);
    if (task) {
      try {
        const data = await apiFetch(`/api/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify({ completed: !task.completed }),
        });
        if (data && data.success) {
          setTasks(tasks.map(t => (t._id === id ? data.task : t)));
        } else {
          setErrorMessage("Failed to toggle task completion.");
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
        setErrorMessage("Error toggling task completion. Please try again.");
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const data = await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (data && data.success) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        setErrorMessage("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Error deleting task. Please try again.");
    }
  };

  if (loading) {
    return <Skeleton repeatCount={4} count={5} type="text" widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]} />;
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

        <button onClick={addTask} className="bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </div>

      {/* List of tasks */}
      <ul className="list-disc space-y-2 pl-5" data-cy="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={`flex justify-between items-center ${task.completed ? 'text-gray-400' : 'text-black'}`}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              data-cy={`task-${task.title}`}
            >
              {task.title}
            </span>
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
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
