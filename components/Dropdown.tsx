import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface DropdownProps<T> {
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  iconMap?: { [key: string]: JSX.Element }; // Opcional: mapeamento de ícones
}

function Dropdown<T extends string>({ options, selectedValue, onSelect, iconMap }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false); // Fecha o dropdown após seleção
  };

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className={`w-full p-3 border rounded flex justify-between items-center transition-colors duration-300 ${
          isOpen ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <span className="flex items-center">
          {iconMap && iconMap[selectedValue]}
          <span className="ml-2">{selectedValue}</span>
        </span>
        <span className="ml-auto">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>
      {isOpen && (
        <div className="absolute w-full mt-1 border rounded bg-white dark:bg-gray-800 shadow-md max-h-60 overflow-y-auto transition-all duration-300 ease-in">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center transition-colors"
            >
              {iconMap && iconMap[option]}
              <span className="ml-2">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
