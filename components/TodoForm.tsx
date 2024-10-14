"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // To dynamically import react-quill
import "react-quill/dist/quill.snow.css"; // React Quill CSS for styling
import Dropdown from "@/components/Dropdown";
import {
  FaAngleDoubleUp,
  FaAngleUp,
  FaEquals,
  FaAngleDown,
  FaAngleDoubleDown,
} from "react-icons/fa";

// Dynamically import react-quill for Markdown-like editor
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Define Task and Category interfaces
interface Task {
  _id?: string;
  title: string;
  resume: string; // Add resume field for short summary
  description?: string; // Add description field for detailed markdown content
  categoryId?: string;
  priority: "highest" | "high" | "medium" | "low" | "lowest";
  dueDate?: string;
  dueTime?: string;
}

interface Category {
  _id: string;
  name: string;
}

const priorityIcons = {
  highest: <FaAngleDoubleUp className="text-red-400" />,
  high: <FaAngleUp className="text-red-300" />,
  medium: <FaEquals className="text-yellow-300" />,
  low: <FaAngleDown className="text-blue-300" />,
  lowest: <FaAngleDoubleDown className="text-blue-200" />,
};

const TodoForm: React.FC<{ task?: Task }> = ({ task }) => {
  const router = useRouter();
  const [taskName, setTaskName] = useState<string>(task?.title || ""); // Task name state
  const [resume, setResume] = useState<string>(task?.resume || ""); // Resume field state
  const [description, setDescription] = useState<string>(
    task?.description || ""
  ); // Description field state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    task?.categoryId || null
  ); // State for selected category
  const [priority, setPriority] = useState<
    "highest" | "high" | "medium" | "low" | "lowest"
  >(task?.priority || "medium"); // State for task priority
  const [dateInput, setDateInput] = useState<string>(task?.dueDate || ""); // State for due date
  const [timeInput, setTimeInput] = useState<string>(task?.dueTime || ""); // State for due time
  const [categories, setCategories] = useState<Category[]>([]); // State for category list
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State for error messages

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await apiFetch("/api/categories", { method: "GET" });
      if (categoryData && categoryData.success) {
        setCategories(categoryData.categories); // Update categories list
      }
    };
    fetchCategories();
  }, []);

  // Load task data into the form when the task changes
  useEffect(() => {
    if (task) {
      setTaskName(task.title || "");
      setResume(task.resume || ""); // Load resume into state
      setDescription(task.description || ""); // Load description into state
      setSelectedCategoryId(task.categoryId || null);
      setPriority(task.priority || "medium");
      setDateInput(
        task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : ""
      );
      setTimeInput(task.dueTime || "");
    }
  }, [task]);

  // Function to handle saving the task (create or update)
  const handleSaveTask = async () => {
    console.log("Selected Category ID:", selectedCategoryId);
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!taskName) newErrors.taskName = "Task name is required";
    if (!resume) newErrors.resume = "Resume is required";

    // Validate if time is provided without a date
    if (timeInput && !dateInput)
      newErrors.dateInput = "Please provide a due date if you set a time.";

    // If there are validation errors, set the error state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors before submission
    setErrors({});

    const taskPayload = {
      title: taskName,
      resume, // Include resume in the payload
      description, // Include description in the payload
      categoryId: selectedCategoryId,
      priority,
      dueDate: dateInput,
      dueTime: timeInput,
    };
    console.log("Task Payload:", taskPayload);

    let updatedTask;

    if (task?._id) {
      // Update existing task
      const response = await apiFetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify(taskPayload),
      });
      if (response && response.success) {
        updatedTask = response.task;
        setTaskName(updatedTask.title);
        setResume(updatedTask.resume); // Update resume and description
        setDescription(updatedTask.description);
      }
    } else {
      // Create a new task
      const response = await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(taskPayload),
      });
      if (response && response.success) {
        updatedTask = response.task;
      }
    }

    // Redirect to the tasks list after saving
    router.push("/tasks");
  };

  // Function to handle deleting the task
  const handleDeleteTask = async () => {
    if (task?._id) {
      await apiFetch(`/api/tasks/${task._id}`, { method: "DELETE" });
      router.push("/tasks");
    }
  };

  return (
    <div data-cy="todo-form" data-testid="todo-form" className="p-4">
      <h1
        className="text-xl font-bold mb-6"
        data-cy="todo-form-info"
        data-testid="todo-form-info"
      >
        {task ? `Edit Task: ${taskName || "Untitled"}` : "Add a New Task"}
      </h1>

      {/* Task Name Input */}
      <div className="w-full mb-6 relative">
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          data-testid="task-input"
          data-cy="task-input"
          className="p-3 text-gray-900 dark:text-gray-300 border border-gray-300 rounded w-full bg-transparent peer focus:outline-none"
        />
        <label
          htmlFor="taskName"
          className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
        >
          Task Name
        </label>
        {errors.taskName && (
          <p
            className="text-sm text-red-500"
            data-cy="task-name-error"
            data-testid="task-name-error"
          >
            {errors.taskName}
          </p>
        )}
      </div>

      {/* Resume (Short Summary) */}
      <div className="w-full mb-6 relative">
        <input
          type="text"
          id="resume"
          name="resume"
          data-testid="resume-input"
          data-cy="resume-input"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder=""
          className="p-3 text-gray-900 dark:text-gray-300 border border-gray-300 rounded w-full bg-transparent peer focus:outline-none"
        />
        <label
          htmlFor="resume"
          className="absolute px-2 text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 origin-[0] left-2 z-10 bg-gray-50 dark:bg-slate-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-transparent"
        >
          Resume
        </label>
        {errors.resume && (
          <p
            className="text-sm text-red-500"
            data-cy="resume-error"
            data-testid="resume-error"
          >
            {errors.resume}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Category Selection */}
        <div>
          <label className="text-gray-500 dark:text-gray-300">Category</label>
          <Dropdown
            testIdPrefix="category-dropdown"
            options={categories.map((cat) => cat.name)}
            selectedValue={
              selectedCategoryId
                ? categories.find((cat) => cat._id === selectedCategoryId)
                    ?.name || "Select Category"
                : "Select Category"
            }
            onSelect={(value) => {
              const selectedCategory = categories.find(
                (cat) => cat.name === value
              );
              setSelectedCategoryId(selectedCategory?._id || null);
            }}
          />
        </div>

        {/* Priority Selection with Dropdown */}
        <div>
          <label className="text-gray-500 dark:text-gray-300">Priority</label>
          <Dropdown
            testIdPrefix="priority-dropdown"
            options={["highest", "high", "medium", "low", "lowest"]}
            selectedValue={priority}
            onSelect={(value) => setPriority(value)}
            iconMap={priorityIcons}
          />
        </div>
      </div>

      {/* Description using ReactQuill (Markdown support) */}
      <div className="w-full mb-6">
        <label
          htmlFor="description"
          className="text-gray-500 dark:text-gray-300"
        >
          Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          className="bg-transparent text-gray-900 dark:text-gray-300 quill-height"
        />
      </div>

      {/* Due Date and Time Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="dateInput"
            className="text-gray-500 dark:text-gray-300"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dateInput"
            name="dateInput"
            data-testid="date-input"
            data-cy="date-input"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="p-3 text-gray-900 dark:text-gray-300 border border-gray-300 rounded w-full bg-transparent focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="timeInput"
            className="text-gray-500 dark:text-gray-300"
          >
            Due Time
          </label>
          <input
            type="time"
            id="timeInput"
            name="timeInput"
            data-testid="time-input"
            data-cy="time-input"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="p-3 text-gray-900 dark:text-gray-300 border border-gray-300 rounded w-full bg-transparent focus:outline-none"
          />
          {errors.dateInput && (
            <p
              className="text-sm text-red-500"
              data-cy="date-input-error"
              data-testid="date-input-error"
            >
              {errors.dateInput}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleSaveTask}
          data-testid="add-task-button"
          data-cy="add-task-button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          Save Task
        </button>
        <button
          onClick={() => router.push("/tasks")}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
        {task?._id && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
            data-cy="task-form-delete"
            data-testid="task-form-delete"
          >
            Delete Task
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-md shadow-lg text-center">
            <p className="mb-4 text-lg">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all"
                data-cy="task-delete-confirm-button"
                data-testid="task-delete-confirm-button"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-all"
                data-cy="task-delete-cancel-button"
                data-testid="task-delete-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoForm;
