"use client";
import React, { useState, useEffect } from "react";
import { useProtectedPage } from "@/hooks/useProtectedPage"; // Custom hook for protected pages
import { apiFetch } from "@/lib/apiFetch"; // Import the apiFetch function for handling requests
import { Skeleton } from "@/components/Loading"; // Import your loading skeleton
import { FaRegTrashAlt } from "react-icons/fa";

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

const CategoriesPage: React.FC = () => {
  const { isAuthenticated, loading } = useProtectedPage(); // Use the new useProtectedPage hook to handle auth
  const [categories, setCategories] = useState<Category[]>([]); // State to hold the categories
  const [newCategoryName, setNewCategoryName] = useState(""); // State for the new category name input
  const [newCategoryDescription, setNewCategoryDescription] = useState(""); // State for the new category description input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error messages

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/api/categories", {
          method: "GET",
        });
        if (data && data.success) {
          setCategories(data.categories);
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Failed to load categories. Please try again.");
      }
    };

    if (isAuthenticated) {
      fetchCategories(); // Only fetch categories if authenticated
    }
  }, [isAuthenticated]); // Dependency array ensures effect runs when auth state changes

  // Render the loading state while authentication check is in progress
  if (loading) {
    return (
      <Skeleton
        data-testid="skeleton-loader" // Component identifier for tests
        repeatCount={4} // Number of times to repeat the entire set
        count={5} // Number of skeletons inside the set
        type="text" // Skeleton type
        widths={["w-1/2", "w-full", "w-full", "w-full", "w-1/2"]} // Widths for each skeleton
        skeletonDuration={1000} // Delay before showing real content
      />
    );
  }

  // Return null if the user is not authenticated (handled in useProtectedPage hook)
  if (!isAuthenticated) {
    return null;
  }

  // Function to add a new category
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
        if (data && data.success) {
          setCategories([...categories, data.category]);
          setNewCategoryName("");
          setNewCategoryDescription("");
        } else {
          setErrorMessage("Failed to add category.");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        setErrorMessage("Error adding category. Please try again.");
      }
    }
  };

  // Function to delete a category
  const deleteCategory = async (id: string) => {
    try {
      const data = await apiFetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (data && data.success) {
        setCategories(categories.filter((category) => category._id !== id));
      } else {
        setErrorMessage("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setErrorMessage("Error deleting category. Please try again.");
    }
  };

  // Render a message if there is an error
  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <div data-cy="categories-list" className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4" data-cy="category-tests">
        Manage Categories
      </h2>

      {/* Form to add a new category */}
      <div className="mb-4" data-cy="categories-form">
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder="Category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder="Category description"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </div>

      {/* List of categories */}
      <ul className="list-disc space-y-2 pl-5" data-cy="category-list">
        {categories.map((category) => (
          <li key={category._id} className="flex justify-between items-center">
            <span data-cy={`category-tests-${category.name}`}>{category.name}</span>
            <button
              onClick={() => deleteCategory(category._id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
            >
              <FaRegTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
