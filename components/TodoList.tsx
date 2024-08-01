import React, { useState } from 'react';
import { FaRegTrashAlt, FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

// Definition of the interface for Task data type
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Initial tasks data as a mock, replaceable by API data later
const initialTasks: Task[] = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
  { id: 3, title: 'Task 3', completed: false }
];

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Function to toggle the completion state of a task
  const toggleTaskCompletion = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Function to add a new task
  const addTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask = { id: Math.max(...tasks.map(t => t.id)) + 1, title: newTaskTitle, completed: false };
      setTasks([...tasks, newTask]);
      setNewTaskTitle(''); // Clear the input field after adding
    }
  };

  // Function to remove a task
  const removeTask = (id: number) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
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
          <li key={task.id} className={`flex justify-between items-center ${task.completed ? 'text-gray-400' : 'text-black'}`}>
            <span className="flex-1" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
              aria-label={`toggle-${task.id}`}
            >
              {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition"
              aria-label={`remove-${task.id}`}
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
