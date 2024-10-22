"use client";
import React, { useState, useEffect } from "react";
import FilterModal from "./FilterModal";
import { apiFetch } from "@/lib/apiFetch";
import {
  FaFilter,
} from "react-icons/fa";
import { Skeleton } from "@/components/Loading";
import { formatForDataCy } from "@/lib/utils";
import PriorityFilter from "./PriorityFilter";
import TaskCard from "./TaskCard"; // Import the TaskCard component

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
    <div data-cy="todo-list" data-testid="todo-list" className="">
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
          const category = categories.find((cat) => cat._id === task.categoryId)?.name || "No category";

          return (
            <TaskCard
              key={task._id}
              task={task}
              category={category}
              toggleTaskCompletion={toggleTaskCompletion}
              onEditTask={onEditTask}
            />
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
