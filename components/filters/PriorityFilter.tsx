/**
 * PriorityFilter.tsx
 * 
 * A filter component for selecting task priority levels.
 * - Renders buttons for each priority level with corresponding icons.
 * - Allows selection and toggling of priority filters, which visually updates based on selection.
 * 
 * @component
 * @param {string[]} selectedPriorities - Array of selected priority levels.
 * @param {function} onPriorityChange - Callback function for updating selected priorities.
 * @param {string} [dataCyPrefix="priority-filter"] - Optional prefix for data-cy attributes in tests.
 * @param {string} [dataTestIdPrefix="priority-filter"] - Optional prefix for data-testid attributes in tests.
 * 
 * @returns A UI component for filtering tasks by priority.
 */

import React from "react";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleUp,
  FaEquals,
} from "react-icons/fa";

interface PriorityFilterProps {
  selectedPriorities: string[];
  onPriorityChange: (priority: string) => void;
  dataCyPrefix?: string; 
  dataTestIdPrefix?: string; 
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ 
  selectedPriorities, 
  onPriorityChange,
  dataCyPrefix = "priority-filter", 
  dataTestIdPrefix = "priority-filter" 
}) => {
  const priorities = ["highest", "high", "medium", "low", "lowest"];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "highest": return <FaAngleDoubleUp className="text-red-600" />;
      case "high": return <FaAngleUp className="text-red-400" />;
      case "medium": return <FaEquals className="text-yellow-500" />;
      case "low": return <FaAngleDown className="text-blue-600" />;
      case "lowest": return <FaAngleDoubleDown className="text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium">Priority</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {priorities.map((priority) => (
          <button
            key={priority}
            className={`flex items-center space-x-1 p-2 rounded-full border transition-all duration-300 ${
              selectedPriorities.includes(priority)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
            onClick={() => onPriorityChange(priority)}
            data-cy={`${dataCyPrefix}-${priority}`}
            data-testid={`${dataTestIdPrefix}-${priority}`}
          >
            {getPriorityIcon(priority)}
            <span className="ml-2 capitalize">{priority}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityFilter;
