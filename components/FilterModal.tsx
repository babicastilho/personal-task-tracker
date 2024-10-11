import React from "react";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleUp,
  FaEquals,
  FaTimes,
} from "react-icons/fa";

interface FilterModalProps {
  selectedPriorities: string[];
  onClose: () => void;
  onPriorityChange: (priority: string) => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  selectedPriorities,
  onClose,
  onPriorityChange,
  onClearFilters,
}) => {
  const priorities = ["highest", "high", "medium", "low", "lowest"];

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={onClearFilters}
              className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          <div className="mb-4 text-sm">
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
                >
                  {getPriorityIcon(priority)}
                  <span className="ml-2 capitalize">{priority}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
