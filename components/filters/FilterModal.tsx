/**
 * FilterModal.tsx
 * 
 * A modal component for displaying and clearing filter options.
 * - Includes a confirmation dialog for clearing all filters.
 * - Supports custom child components within the modal for dynamic filter options.
 * 
 * @component
 * @param {function} onClose - Function to handle closing the modal.
 * @param {function} onClearFilters - Function to handle clearing all applied filters.
 * @param {React.ReactNode} children - Custom filter components or content to render inside the modal.
 * 
 * @returns A modal UI component with clear filter functionality and confirmation dialog.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
            <h2 className="text-xl font-semibold">{t("filters.title")}</h2>
            <button
              onClick={onClearFilters}
              data-cy="clear-filters-button"
              data-testid="clear-filters-button"
              className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              {t("filters.clear")}
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
            {t("filters.clear")}
            </p>
            <div className="flex w-full justify-center mt-4 space-x-2">
              <button
                onClick={confirmClearFilters}
                data-cy="confirm-clear-filters"
                data-testid="confirm-clear-filters"
                className="text-sm bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                {t("filters.confirm_button")}
              </button>
              <button
                onClick={cancelClearFilters}
                data-cy="cancel-clear-filters"
                data-testid="cancel-clear-filters"
                className="text-sm bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                {t("filters.cancel_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterModal;
