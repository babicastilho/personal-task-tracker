'use client'
import React, { useState, useEffect } from 'react';

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  useEffect(() => {
    // Fetch existing categories from the API
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (newCategoryName.trim() !== '') {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDescription }),
      });
      const data = await response.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setNewCategoryName('');
        setNewCategoryDescription('');
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      setCategories(categories.filter(category => category._id !== id));
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
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
        {categories.map(category => (
          <li key={category._id} className="flex justify-between items-center">
            <span>{category.name}</span>
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
