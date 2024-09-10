"use client";
import React, { useState, useEffect } from "react";
import { checkAuth } from "@/lib/auth"; // Import function to check authentication
import { Skeleton } from "@/components/Loading";

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          await fetchCategories(); // Fetch categories if user is authenticated
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = document.cookie.split("authToken=")[1]; // Extract token from cookies
      const response = await fetch("/api/categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async () => {
    if (newCategoryName.trim() !== "") {
      try {
        const token = document.cookie.split("authToken=")[1];
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
          body: JSON.stringify({
            name: newCategoryName,
            description: newCategoryDescription,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setCategories([...categories, data.category]);
          setNewCategoryName("");
          setNewCategoryDescription("");
        } else {
          console.error("Failed to add category:", data.message);
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = document.cookie.split("authToken=")[1];
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(categories.filter((category) => category._id !== id));
      } else {
        console.error("Failed to delete category:", data.message);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <Skeleton
        repeatCount={3} // Number of times to repeat the entire set
        count={4} // Number of skeletons inside the set
        type="text" // Skeleton type
        widths={["w-full", "w-3/4", "w-3/4", "w-1/2"]} // Widths for each skeleton
        skeletonDuration={1000} // Delay before showing real content
      />
    );
  }

  if (!isAuthenticated) {
    return <p>Please log in to manage your categories.</p>;
  }

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4">Manage Categories</h2>
      <div className="mb-4">
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
      <ul className="list-disc space-y-2 pl-5">
        {categories.map((category) => (
          <li key={category._id} className="flex justify-between items-center">
            <span data-cy={`category-tests-${category.name}`}>
              {category.name}
            </span>
            <button
              onClick={() => deleteCategory(category._id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
