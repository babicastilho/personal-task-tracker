"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardsView from "@/components/tasks/CardsView";
import { Skeleton } from "@/components/Loading";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { apiFetch } from "@/lib/apiFetch";
import { Task, Category } from "@/types/TaskCategoryTypes";
import FilterModal from "@/components/filters/FilterModal";
import PriorityFilter from "@/components/filters/PriorityFilter";
import { FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function TasksPage() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useProtectedPage();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredTasks = tasks.filter((task) =>
    selectedPriorities.length > 0
      ? selectedPriorities.includes(task.priority.toLowerCase())
      : true
  );

  const clearFilters = () => {
    setSelectedPriorities([]);
  };

  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        const taskData = await apiFetch("/api/tasks", { method: "GET" });
        if (taskData && taskData.success) {
          setTasks(taskData.tasks);
        } else {
          setErrorMessage(t("tasksPage.fetchError"));
        }

        const categoryData = await apiFetch("/api/categories", {
          method: "GET",
        });
        if (categoryData && categoryData.success) {
          setCategories(categoryData.categories);
        } else {
          setErrorMessage(t("tasksPage.fetchError"));
        }
      } catch (error) {
        setErrorMessage(t("tasksPage.fetchError"));
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) fetchTasksAndCategories();
  }, [isAuthenticated, t]);

  if (loading || loadingData) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Skeleton
          repeatCount={3}
          count={2}
          type="text"
          widths={["w-full", "w-3/4"]}
          skeletonDuration={1000}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="mt-20 p-8 dark:text-gray-300"
      data-cy="todo-list"
      data-testid="todo-list"
    >
      <div className="mb-4 flex justify-between">
        <h1
          className="text-xl font-bold"
          data-cy="todo-list-title"
          data-testid="todo-list-title"
        >
          {t("tasksPage.title")}
        </h1>
        <div className="flex items-center">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            data-cy="filter-modal-button"
            data-testid="filter-modal-button"
          >
            <FaFilter className="mr-1" />
            {t("tasksPage.filterButton")}
          </button>

          <button
            onClick={() => router.push("/tasks/new")}
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition-all"
            data-cy="button-add-task"
            data-testid="button-add-task"
          >
            {t("tasksPage.addNewTaskButton")}
          </button>
        </div>
      </div>

      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onClearFilters={clearFilters}
        >
          <PriorityFilter
            selectedPriorities={selectedPriorities}
            onPriorityChange={(priority: string) =>
              setSelectedPriorities((prevPriorities) =>
                prevPriorities.includes(priority)
                  ? prevPriorities.filter((p) => p !== priority)
                  : [...prevPriorities, priority]
              )
            }
          />
        </FilterModal>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {filteredTasks.length === 0 && (
        <p className="text-gray-500 mt-4">
          {tasks.length === 0
            ? t("tasksPage.noTasks")
            : t("tasksPage.noFilteredTasks")}
        </p>
      )}

      <CardsView
        tasks={filteredTasks}
        categories={categories}
        onEditTask={(id) => router.push(`/tasks/edit/${id}`)}
      />
    </div>
  );
}
