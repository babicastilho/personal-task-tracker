"use client";
import React, { useState, useEffect } from "react";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { apiFetch } from "@/lib/apiFetch";
import { Skeleton } from "@/components/Loading";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

const CategoriesPage: React.FC = () => {
  const { isAuthenticated, loading } = useProtectedPage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("useEffect triggered"); // Log para verificar reexecuções

    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const data = await apiFetch("/api/categories", { method: "GET" });
        console.log("GET Response:", data);

        if (data && data.success) {
          setCategories(data.categories);
        } else {
          setErrorMessage("Error fetching categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Skeleton
        data-testid="categories-skeleton"
        repeatCount={4}
        count={5}
        type="text"
        widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]}
        skeletonDuration={1000}
      />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const addCategory = async () => {
    if (newCategoryName.trim() !== "") {
      try {
        const data = await apiFetch("/api/categories", {
          method: "POST",
          body: JSON.stringify({
            name: newCategoryName,
            description: newCategoryDescription,
          }),
        });
        console.log("POST Response:", data); // Log the API response for POST

        if (data && data.success) {
          const updatedCategories = [...categories, data.category];
          setCategories(updatedCategories);
          console.log("Updated Categories:", updatedCategories); // Log the updated state

          setNewCategoryName("");
          setNewCategoryDescription("");
        } else {
          setErrorMessage(t("categories.errorAddingCategory"));
        }
      } catch (error) {
        console.error("Error adding category:", error); // Log any errors
        setErrorMessage(t("categories.errorAddingCategory"));
      }
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const data = await apiFetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      console.log("DELETE Response:", data); // Log the API response for DELETE

      if (data && data.success) {
        const updatedCategories = categories.filter(
          (category) => category._id !== id
        );
        setCategories(updatedCategories);
        console.log("Categories after deletion:", updatedCategories); // Log the updated state
      } else {
        setErrorMessage(t("categories.errorDeletingCategory"));
      }
    } catch (error) {
      console.error("Error deleting category:", error); // Log any errors
      setErrorMessage(t("categories.errorDeletingCategory"));
    }
  };

  return (
    <div data-testid="categories-list" className="mt-24 p-8 dark:text-gray-300">
      <h2
        className="text-lg font-bold mb-4"
        data-testid="categories-title"
        data-cy="categories-title"
      >
        {t("categories.manageCategories")}
      </h2>

      {errorMessage && (
        <p className="text-red-500" data-testid="categories-error">
          {errorMessage}
        </p>
      )}

      <div
        className="mb-4"
        data-testid="categories-form"
        data-cy="categories-form"
      >
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder={t("categories.categoryNamePlaceholder")}
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          data-testid="category-name-input"
          data-cy="category-name-input"
        />
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder={t("categories.categoryDescriptionPlaceholder")}
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          data-testid="category-description-input"
          data-cy="category-description-input"
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
          data-testid="category-add-button"
          data-cy="category-add-button"
        >
          {t("categories.addCategoryButton")}
        </button>
      </div>

      <ul
        className="list-disc space-y-2 pl-5"
        data-testid="category-list-items"
        data-cy="category-list-items"
      >
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center"
            >
              <span
                data-testid={`category-name-${category._id}`}
                data-cy={`category-name-${category._id}`}
              >
                {category.name}
              </span>
              <button
                data-testid={`delete-category-${category._id}`}
                data-cy={`delete-category-${category._id}`}
                onClick={() => deleteCategory(category._id)}
                className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
              >
                <FaRegTrashAlt />
              </button>
            </li>
          ))
        ) : (
          <p
            data-testid="no-categories-message"
            data-cy="no-categories-message"
            className="text-gray-500"
          >
            {t("categories.emptyMessage")}
          </p>
        )}
      </ul>
    </div>
  );
};

export default CategoriesPage;
