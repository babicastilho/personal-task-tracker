import React, { useState } from "react";
import {
  FaAngleUp,
  FaAngleDown,
  FaEquals,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from "react-icons/fa";

interface PriorityDropdownProps {
  selectedPriority: "highest" | "high" | "medium" | "low" | "lowest";
  onSelectPriority: (priority: "highest" | "high" | "medium" | "low" | "lowest") => void;
}

const priorityOptions = [
  { value: "highest", label: "Highest", icon: <FaAngleDoubleUp className="text-red-400" /> },
  { value: "high", label: "High", icon: <FaAngleUp className="text-red-300" /> },
  { value: "medium", label: "Medium", icon: <FaEquals className="text-yellow-300" /> },
  { value: "low", label: "Low", icon: <FaAngleDown className="text-blue-300" /> },
  { value: "lowest", label: "Lowest", icon: <FaAngleDoubleDown className="text-blue-200" /> },
];

const PriorityDropdown: React.FC<PriorityDropdownProps> = ({ selectedPriority, onSelectPriority }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: "highest" | "high" | "medium" | "low" | "lowest") => {
    onSelectPriority(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-2 border rounded transition-all duration-300 ease-in-out ${
          isOpen ? "bg-white dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800 border-gray-300"
        }`}
      >
        <div className="flex items-center">
          {priorityOptions.find(option => option.value === selectedPriority)?.icon}
          <span className="ml-2">{priorityOptions.find(option => option.value === selectedPriority)?.label}</span>
        </div>
        <span className="ml-auto">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>

      <ul
        className={`z-10 absolute w-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {priorityOptions.map(option => (
          <li key={option.value}>
            <button
              onClick={() => handleSelect(option.value as "highest" | "high" | "medium" | "low" | "lowest")}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriorityDropdown;
