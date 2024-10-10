"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import {
  FaRegCheckSquare,
  FaRegSquare,
  FaPen,
  FaRegCalendarAlt,
  FaAngleUp,
  FaAngleDown,
  FaEquals,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from "react-icons/fa";
import { Skeleton } from "@/components/Loading";
import { formatForDataCy } from "@/lib/utils";

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "highest" | "high" | "medium" | "low" | "lowest";
  dueDate?: string | undefined;
  dueTime?: string | undefined;
  categoryId?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface TodoListProps {
  onAddTask: () => void;
  onEditTask: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onAddTask, onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        const taskData = await apiFetch("/api/tasks", { method: "GET" });
        if (taskData && taskData.success) {
          setTasks(taskData.tasks);
        } else {
          setErrorMessage("Failed to fetch tasks.");
        }

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

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((task) => task._id === id);
    if (task) {
      try {
        const data = await apiFetch(`/api/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            completed: !task.completed,
            priority: task.priority,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
          }),
        });
        if (data && data.success) {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === id ? data.task : t))
          );
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }
  };

  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    return currentDate > taskDueDate;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "highest":
        return <FaAngleDoubleUp className="text-red-600" />;
      case "high":
        return <FaAngleUp className="text-red-400" />;
      case "medium":
        return <FaEquals className="text-yellow-500" />;
      case "low":
        return <FaAngleDown className="text-blue-600" />;
      case "lowest":
        return <FaAngleDoubleDown className="text-blue-400" />;
      default:
        return null;
    }
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

  return (
    <div data-cy="todo-list" data-testid="todo-list" className="px-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Your To-Do List</h1>
        <button
          onClick={onAddTask}
          className="bg-blue-500 text-white p-2 rounded"
          data-testid="button-add-task"
          data-cy="button-add-task"
        >
          Add New Task
        </button>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {tasks.map((task) => {
          const dueDate = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date";
          const category = categories.find(
            (cat) => cat._id === task.categoryId
          );

          console.log("Task:", task.title, "Category ID:", task.categoryId, "Category Found:", category);

          return (
            <div
              key={task._id}
              className={`relative flex flex-col justify-between p-4 border rounded-md shadow-md transition-all ${
                isTaskOverdue(task.dueDate) && !task.completed
                  ? "border-red-600 dark:border-red-400"
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
                  className={`font-semibold flex items-center ${
                    task.completed ? "line-through" : ""
                  }`}
                  data-testid={`task-title-${task._id}`}
                  data-cy={`task-title-${task._id}`}
                >
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1">{task.title}</span>
                </span>
                <button
                  onClick={() => toggleTaskCompletion(task._id)}
                  className="text-blue-500 mt-2"
                  aria-label={`toggle-${task._id}`}
                  data-cy={`todo-edit-${formatForDataCy}`}
                  data-testid={`todo-edit-${formatForDataCy}`}
                >
                  {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
                </button>
              </div>

              <div className="my-3 text-sm text-gray-500">
                <p className="flex items-center">
                  {category ? category.name : "No category"}
                </p>
                <p className="flex items-center">
                  <FaRegCalendarAlt
                    className={`mr-1 ${
                      isTaskOverdue(task.dueDate) && !task.completed
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                    title={
                      isTaskOverdue(task.dueDate) && !task.completed
                        ? "Overdue"
                        : "Due Date"
                    }
                  />
                  <span className={`ml-1 ${
                      isTaskOverdue(task.dueDate) && !task.completed
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>{dueDate}</span>
                </p>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => onEditTask(task._id)}
                  className="transition-all bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
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
