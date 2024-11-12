/**
 * TaskCard.tsx
 * 
 * Component for rendering an individual task card in a list or board view.
 * 
 * - Displays task details such as title, priority, category, and due date.
 * - Highlights overdue tasks by applying a different border color.
 * - Provides an edit button that triggers the onEditTask callback.
 * 
 * @param task - The task object containing details like title, priority, due date, and category.
 * @param onEditTask - Callback function to handle task editing, receives the task ID as a parameter.
 * @param category - The category name associated with the task.
 * 
 * @returns A styled task card with relevant information and actions.
 */

import React from "react";
import {
  FaPen,
  FaRegCalendarAlt,
  FaAngleDoubleDown,
  FaEquals,
  FaAngleDown,
  FaAngleUp,
  FaAngleDoubleUp,
} from "react-icons/fa";

import { formatForDataCy } from "@/lib/utils";
import { Task } from "@/types/TaskCategoryTypes";

interface TaskCardProps {
  task: Task;
  onEditTask: (id: string) => void;
  category: string | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEditTask, category }) => {
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
        isTaskOverdue(task.dueDate)
          ? "border-red-600 dark:border-red-400"
          : "border-gray-200 dark:border-gray-900"
      } bg-white dark:bg-gray-800`}
      data-testid={`task-card-${formatForDataCy(task.title)}`}
      data-cy={`task-card-${formatForDataCy(task.title)}`}
    >
      <div className="flex justify-between items-start">
        <span
          className="font-semibold flex items-center"
          data-testid={`task-title-${task._id}`}
          data-cy={`task-title-${task._id}`}
        >
          <span className="ml-1">{task.title}</span>
        </span>
      </div>

      <div className="my-3 text-sm text-gray-500">
        <p className="flex items-center">
          {getPriorityIcon(task.priority)}{" "}
          <span className="ml-1 capitalize">{task.priority} priority</span>
        </p>
        <p>{category || "No category"}</p>
        <p className={`mt-1 flex items-center ${
              isTaskOverdue(task.dueDate) ? "text-red-600" : "text-gray-500"
            }`}>
          <FaRegCalendarAlt
            className="mr-1"
          />
          {dueDate}
        </p>
      </div>

      <div className="mt-2">
        <button
          onClick={() => onEditTask(task._id)}
          className="transition-all bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
          aria-label={`edit-${task._id}`}
          data-testid={`edit-task-${formatForDataCy(task.title)}`}
          data-cy={`edit-task-${formatForDataCy(task.title)}`}
        >
          <FaPen />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
