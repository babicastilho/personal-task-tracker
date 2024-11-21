import React from "react";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleUp,
  FaEquals,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(); // Hook for translations

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
      <h3 className="text-lg font-medium">{t("priority.title")}</h3>
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
            <span className="ml-2 capitalize">{t(`priority.${priority}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityFilter;
