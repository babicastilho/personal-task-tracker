// components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt, FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find(task => task._id === id);
      if (task) {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`,
          },
          body: JSON.stringify({ completed: !task.completed }),
        });
        const data = await response.json();
        if (data.success) {
          setTasks(tasks.map(task => (task._id === id ? data.task : task)));
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addTask = async () => {
    if (newTaskTitle.trim() !== '') {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`,
          },
          body: JSON.stringify({ title: newTaskTitle }),
        });
        const data = await response.json();
        if (data.success) {
          setTasks([...tasks, data.task]);
          setNewTaskTitle('');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('authToken=')[1]}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(task => task._id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Task List</h2>
      <div className="mb-4">
        <input
          type="text"
          className="mr-2 p-2 border border-gray-300 rounded"
          placeholder="Enter new task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          onClick={addTask}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>
      <ul className="list-disc space-y-2 pl-5">
        {tasks.map(task => (
          <li key={task._id} className={`flex justify-between items-center ${task.completed ? 'text-gray-400' : 'text-black'}`}>
            <span className="flex-1" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button
              onClick={() => toggleTaskCompletion(task._id)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
              aria-label={`toggle-${task._id}`}
            >
              {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
            </button>
            <button
              onClick={() => removeTask(task._id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
              aria-label={`remove-${task._id}`}
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
