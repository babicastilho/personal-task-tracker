// TodoList.tsx
"use client";
import React, { useState, useEffect } from "react";
import FilterModal from "./FilterModal";
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
  FaFilter,
} from "react-icons/fa";
import { Skeleton } from "@/components/Loading";
import { formatForDataCy } from "@/lib/utils";
import PriorityFilter from "./PriorityFilter";

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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

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

  const handlePriorityChange = (priority: string) => {
    setSelectedPriorities(
      (prevPriorities) =>
        prevPriorities.includes(priority)
          ? prevPriorities.filter((p) => p !== priority) // Remove if exists
          : [...prevPriorities, priority] // Add if doesn't exist
    );
  };

  const filteredTasks = tasks.filter((task) =>
    selectedPriorities.length > 0
      ? selectedPriorities.includes(task.priority)
      : true
  );

  // Define clearFilters function to clear selected priorities
  const clearFilters = () => {
    setSelectedPriorities([]); // Reset the selected priorities
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
        <div className="flex items-center">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            data-testid="filter-modal-button"
            data-cy="filter-modal-button"
          >
            <FaFilter className="mr-1" />
            Filter
          </button>
          <button
            onClick={onAddTask}
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition-all"
            data-testid="button-add-task"
            data-cy="button-add-task"
          >
            Add New Task
          </button>
        </div>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {filteredTasks.length === 0 && (
        <p className="text-gray-500 mt-4">
          {tasks.length === 0
            ? "No tasks added yet. How about adding your first task?"
            : "No tasks match the applied filters. Try adjusting the filters to view your tasks."}
        </p>
      )}

      <div
        className="mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4"
        data-testid="task-list"
        data-cy="task-list"
      >
        {filteredTasks.map((task) => {
          const dueDate = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date";
          const category = categories.find(
            (cat) => cat._id === task.categoryId
          );

          return (
            <div
              key={task._id}
              className={`relative flex flex-col justify-between p-4 border rounded-md shadow-md transition-all ${
                isTaskOverdue(task.dueDate) && !task.completed
                  ? "border-red-600 dark:border-red-400"
                  : "border-gray-200 dark:border-gray-900"
              } ${
                task.completed
                  ? "bg-gray-100 dark:bg-gray-700 border-0 text-gray-500"
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
                  <span
                    className={`ml-1 ${
                      isTaskOverdue(task.dueDate) && !task.completed
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {dueDate}
                  </span>
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

      {showFilterModal && (
        <FilterModal
          key={showFilterModal ? "open" : "closed"}
          onClose={() => setShowFilterModal(false)}
          onClearFilters={clearFilters}
        >
          <PriorityFilter
            selectedPriorities={selectedPriorities}
            onPriorityChange={handlePriorityChange}
          />
          {/* Adicione outros filtros aqui */}
        </FilterModal>
      )}
    </div>
  );
};

export default TodoList;
