import React from "react";
import {
  FaRegCheckSquare,
  FaRegSquare,
  FaPen,
  FaRegCalendarAlt,
  FaAngleDoubleDown,
  FaEquals,
  FaAngleDown,
  FaAngleUp,
  FaAngleDoubleUp,
} from "react-icons/fa";
import { Task } from "./TodoList"; // Import the Task interface from TodoList

interface TaskCardProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  onEditTask: (id: string) => void;
  category: string | null;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  toggleTaskCompletion,
  onEditTask,
  category,
}) => {
  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    return currentDate > taskDueDate;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "highest":
        return <FaAngleDoubleUp className="text-red-600" />;
      case "high":
        return <FaAngleUp className="text-red-400" />;
      case "medium":
        return <FaEquals className="text-yellow-500" />;
      case "low":
        return <FaAngleDown className="text-blue-600" />;
      case "lowest":
        return <FaAngleDoubleDown className="text-blue-400" />;
      default:
        return null;
    }
  };

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div
      className={`relative flex flex-col justify-between p-4 border rounded-md shadow-md transition-all ${
        isTaskOverdue(task.dueDate) && !task.completed
          ? "border-red-600 dark:border-red-400"
          : "border-gray-200 dark:border-gray-900"
      } ${
        task.completed
          ? "bg-gray-100 dark:bg-gray-700 border-0 text-gray-500"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex justify-between items-start">
        <span
          className={`font-semibold flex items-center ${
            task.completed ? "line-through" : ""
          }`}
        >
          <span className="ml-1">{task.title}</span>
        </span>
        <button
          onClick={() => toggleTaskCompletion(task._id)}
          className="text-blue-500 mt-2"
          aria-label={`toggle-${task._id}`}
        >
          {task.completed ? <FaRegCheckSquare /> : <FaRegSquare />}
        </button>
      </div>

      <div className="my-3 text-sm text-gray-500">
        <p className="flex items-center">
          {getPriorityIcon(task.priority)}{" "}
          <span className="ml-1 capitalize">{task.priority}{" "}priority</span>
        </p>
        <p>{category || "No category"}</p>
        <p className="mt-1 flex items-center">
          <FaRegCalendarAlt
            className={`mr-1 ${
              isTaskOverdue(task.dueDate) ? "text-red-600" : "text-gray-500"
            }`}
          />
          {dueDate}
        </p>
      </div>

      <div className="mt-2">
        <button
          onClick={() => onEditTask(task._id)}
          className="transition-all bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
          aria-label={`edit-${task._id}`}
        >
          <FaPen />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
