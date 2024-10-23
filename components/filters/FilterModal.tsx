import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface FilterModalProps {
  onClose: () => void;
  onClearFilters: () => void;
  children: React.ReactNode;
}

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onClearFilters,
  children,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClose = () => {
    setShowConfirmation(true);
  };

  const confirmClearFilters = () => {
    onClearFilters();
    setShowConfirmation(false);
    onClose();
  };

  const cancelClearFilters = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      data-cy="filter-modal"
      data-testid="filter-modal"
    >
      <div className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={onClearFilters}
              data-cy="clear-filters-button"
              data-testid="clear-filters-button"
              className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
          <button
            onClick={handleClose}
            data-cy="close-modal-button"
            data-testid="close-modal-button"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          {children}
        </div>
      </div>

      {showConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          data-cy="confirmation-modal"
          data-testid="confirmation-modal"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-lg font-medium">
              Do you want to clear all filters?
            </p>
            <div className="flex w-full justify-center mt-4 space-x-2">
              <button
                onClick={confirmClearFilters}
                data-cy="confirm-clear-filters"
                data-testid="confirm-clear-filters"
                className="text-sm bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Yes, clear filters
              </button>
              <button
                onClick={cancelClearFilters}
                data-cy="cancel-clear-filters"
                data-testid="cancel-clear-filters"
                className="text-sm bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                No, just close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterModal;
