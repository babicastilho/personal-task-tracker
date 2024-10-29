/**
 * Dropdown.tsx
 * 
 * Generic dropdown component for selecting an option from a list.
 * 
 * - Displays a list of options, allows selecting one, and shows an icon next to the selected item if an icon map is provided.
 * - Toggles between open and closed states to show or hide the options list.
 * - Supports customizable `data-cy` and `data-testid` prefixes for testing.
 * 
 * @param options - Array of selectable options.
 * @param selectedValue - The currently selected option.
 * @param onSelect - Callback function triggered when an option is selected, passing the selected value.
 * @param iconMap - Optional object mapping each option to an icon.
 * @param testIdPrefix - Optional prefix for `data-cy` and `data-testid` attributes.
 * 
 * @returns A dropdown component with interactive options and an icon display if provided.
 */

import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface DropdownProps<T> {
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  iconMap?: { [key: string]: JSX.Element };
  testIdPrefix?: string; 
}

function Dropdown<T extends string>({
  options,
  selectedValue,
  onSelect,
  iconMap,
  testIdPrefix = "dropdown" // Valor padrão se não for fornecido
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="z-10 relative w-full">
      <button
        onClick={toggleDropdown}
        data-cy={`${testIdPrefix}-toggle`}
        data-testid={`${testIdPrefix}-toggle`}
        className={`w-full p-3 border rounded flex justify-between items-center transition-colors duration-300 ${
          isOpen ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <span className="flex items-center">
          {iconMap && iconMap[selectedValue]}
          <span className="ml-2">
            {selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1)}
          </span>
        </span>
        <span className="ml-auto">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>
      {isOpen && (
        <div
          data-cy={`${testIdPrefix}-options`}
          data-testid={`${testIdPrefix}-options`}
          className="absolute w-full mt-1 border rounded bg-white dark:bg-gray-800 shadow-md max-h-60 overflow-y-auto transition-all duration-300 ease-in"
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              data-cy={`${testIdPrefix}-option-${option}`}
              data-testid={`${testIdPrefix}-option-${option}`}
              className="w-full p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center transition-colors"
            >
              {iconMap && iconMap[option]}
              <span className="ml-2">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
