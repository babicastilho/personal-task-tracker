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
  const [categories, setCategories] = useState<Category[]>([]); // State to hold the categories
  const [newCategoryName, setNewCategoryName] = useState(""); // State for the new category name input
  const [newCategoryDescription, setNewCategoryDescription] = useState(""); // State for the new category description input
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State to track user authentication
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // useEffect to handle authentication and fetch categories on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth(); // Check if the user is authenticated
        setIsAuthenticated(authenticated);
        if (authenticated) {
          await fetchCategories(); // Fetch categories if the user is authenticated
        }
      } catch (error) {
        console.error("Failed to check authentication:", error); // Log authentication errors
      } finally {
        setLoading(false); // Set loading to false after the process completes
      }
    };

    verifyAuth();
  }, []);

  // Function to fetch categories from the server
  const fetchCategories = async () => {
    try {
      const token = document.cookie.split("authToken=")[1]; // Extract token from cookies
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch("/api/categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Parse response JSON
      if (data.success) {
        setCategories(data.categories); // Update state with fetched categories
      } else {
        console.error("Failed to fetch categories:", data.message); // Log any errors from the response
      }
    } catch (error) {
      console.error("Error fetching categories:", error); // Log any errors during fetching
    }
  };

  // Function to add a new category
  const addCategory = async () => {
    if (newCategoryName.trim() !== "") {
      try {
        const token = document.cookie.split("authToken=")[1];
        if (!token) {
          throw new Error("No token found");
        }

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

        // Handle response
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); // Parse response JSON
        if (data.success) {
          setCategories([...categories, data.category]); // Add new category to the state
          setNewCategoryName("");
          setNewCategoryDescription(""); // Clear input fields after successful addition
        } else {
          console.error("Failed to add category:", data.message); // Log any errors from the response
        }
      } catch (error) {
        console.error("Error adding category:", error); // Log any errors during adding
      }
    }
  };

  // Function to delete a category
  const deleteCategory = async (id: string) => {
    try {
      const token = document.cookie.split("authToken=")[1];
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      // Handle response
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Parse response JSON
      if (data.success) {
        setCategories(categories.filter((category) => category._id !== id)); // Update state by filtering out deleted category
      } else {
        console.error("Failed to delete category:", data.message); // Log any errors from the response
      }
    } catch (error) {
      console.error("Error deleting category:", error); // Log any errors during deletion
    }
  };

  // Render the loading state
  if (loading) {
    return (
      <Skeleton
        data-testid="skeleton-loader" // Component identifier for tests
        repeatCount={3} // Number of times to repeat the entire set
        count={4} // Number of skeletons inside the set
        type="text" // Skeleton type
        widths={["w-1/2", "w-full", "w-full", "w-1/2"]} // Widths for each skeleton
        skeletonDuration={1000} // Delay before showing real content
      />
    );
  }

  // Render a message if the user is not authenticated
  if (!isAuthenticated) {
    return <p>Please log in to manage your categories.</p>;
  }

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4">Manage Categories</h2>

      {/* Form to add a new category */}
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

      {/* List of categories */}
      <ul className="list-disc space-y-2 pl-5">
        {categories.map((category) => (
          <li key={category._id} className="flex justify-between items-center">
            <span data-cy={`category-tests-${category.name}`}>{category.name}</span>
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
