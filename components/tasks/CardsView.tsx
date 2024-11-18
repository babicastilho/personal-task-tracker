/**
 * CardsView.tsx
 * 
 * Displays a grid view of tasks as cards, with functionality to toggle task completion.
 * 
 * - Maps each task to a TaskCard component with category and status information.
 * - Toggles the completion status of tasks on click, with API calls to update the backend.
 * - Displays a message if no tasks are available.
 * 
 * @param tasks - Array of tasks to display.
 * @param categories - Array of categories to match with tasks.
 * @param onEditTask - Callback to handle task editing.
 * 
 * @returns A grid of TaskCard components or a message if no tasks are available.
 */

"use client";
import React from "react";
import TaskCard from "@/components/common/TaskCard";
import { Task, Category } from "@/types/TaskCategoryTypes";
import { apiFetch } from "@/lib/apiFetch";
import { useTranslation } from "react-i18next"; // Import useTranslation for translations

interface CardsViewProps {
  tasks: Task[];
  categories: Category[];
  onEditTask: (id: string) => void;
}

const CardsView: React.FC<CardsViewProps> = ({ tasks, categories, onEditTask }) => {
  const { t } = useTranslation();

  const toggleTaskCompletion = async (id: string) => {
    const taskToToggle = tasks.find((task) => task._id === id);
    if (!taskToToggle) return;

    try {
      const updatedTask = await apiFetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          completed: !taskToToggle.completed,
        }),
      });

      if (updatedTask && updatedTask.success) {
        // The state is updated in the parent component
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-gray-500 mt-4">{t("task.no_tasks")}</p>;
  }

  return (
    <div
      className="mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4"
      data-cy="task-list"
      data-testid="task-list"
    >
      {tasks.map((task) => {
        const category =
          categories.find((cat) => cat._id === task.categoryId)?.name || t("task.no_category");
        return (
          <TaskCard
            key={task._id}
            task={task}
            category={category}
            onEditTask={onEditTask}
          />
        );
      })}
    </div>
  );
};

export default CardsView;
