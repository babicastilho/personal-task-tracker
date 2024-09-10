import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt, FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

// Define the Task and Category interfaces
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface Category {
  _id: string;
  name: string;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks
  const [newTaskTitle, setNewTaskTitle] = useState(''); // State to store new task title
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // State to store selected category ID

  // useEffect to fetch tasks and categories from the API when the component mounts
  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      try {
        // Fetch tasks
        const taskResponse = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`, // Add token to request
          },
        });
        const taskData = await taskResponse.json();
        if (taskData.success) {
          setTasks(taskData.tasks); // Set tasks in state if request is successful
        }

        // Fetch categories
        const categoryResponse = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`, // Add token to request
          },
        });
        const categoryData = await categoryResponse.json();
        if (categoryData.success) {
          setCategories(categoryData.categories); // Set categories in state if request is successful
        }
      } catch (error) {
        console.error('Error fetching data:', error); // Log any error that occurs
      }
    };

    fetchTasksAndCategories(); // Call the function to fetch tasks and categories
  }, []);

  // Function to add a new task
  const addTask = async () => {
    if (newTaskTitle.trim() !== '') {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`, // Add token to request
          },
          body: JSON.stringify({ title: newTaskTitle, categoryId: selectedCategoryId }), // Send the title and categoryId to the API
        });
        const data = await response.json();
        if (data.success) {
          setTasks([...tasks, data.task]); // Add the new task to the state
          setNewTaskTitle(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error adding task:', error); // Log any error that occurs
      }
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find(task => task._id === id); // Find the task to be toggled
      if (task) {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`, // Add token to request
          },
          body: JSON.stringify({ completed: !task.completed }), // Toggle the completion status
        });
        const data = await response.json();
        if (data.success) {
          setTasks(tasks.map(task => (task._id === id ? data.task : task))); // Update the task in the state
        }
      }
    } catch (error) {
      console.error('Error updating task:', error); // Log any error that occurs
    }
  };

  // Function to remove a task
  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`, // Add token to request
        },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(task => task._id !== id)); // Remove the task from the state
      }
    } catch (error) {
      console.error('Error deleting task:', error); // Log any error that occurs
    }
  };

  return (
    <div className="p-4 dark:text-gray-300">
      <h2 className="text-lg font-bold mb-4">Task List</h2>

      {/* Input for new task title */}
      <div className="mb-4">
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder="Enter new task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)} // Update state when task title is changed
          data-cy="task-input" // Add data-cy for testing
        />

        {/* Dropdown for selecting category */}
        <select
          className="mr-2 p-2 border border-gray-300 rounded"
          value={selectedCategoryId || ''}
          onChange={(e) => setSelectedCategoryId(e.target.value || null)} // Update state when category is changed
          data-cy="category-select" // Add data-cy for testing
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id} data-cy={`category-option-${category._id}`}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Button to add new task */}
        <button
          onClick={addTask}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
          data-cy="add-task-button" // Add data-cy for testing
        >
          Add Task
        </button>
      </div>

      {/* List of tasks */}
      <ul className="list-disc space-y-2 pl-5">
        {tasks.map(task => (
          <li
            key={task._id}
            className={`flex justify-between items-center ${task.completed ? 'text-gray-500' : 'text-black dark:text-gray-300'}`}
            data-cy={`task-item-${task._id}`} // Add data-cy for testing
          >
            {/* Task title with line-through if completed */}
            <span className="flex-1" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>

            {/* Button to toggle task completion */}
            <button
              onClick={() => toggleTaskCompletion(task._id)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
              aria-label={`toggle-${task._id}`}
              data-cy={`toggle-task-${task._id}`} // Add data-cy for testing
            >
              {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
            </button>

            {/* Button to remove task */}
            <button
              onClick={() => removeTask(task._id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
              aria-label={`remove-${task._id}`}
              data-cy={`remove-task-${task._id}`} // Add data-cy for testing
            >
              <FaRegTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
