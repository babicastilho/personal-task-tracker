interface FilterBaseProps {
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
  filterType: "button" | "checkbox" | "string";
  getIcon?: (value: string) => JSX.Element | null;
  dataCyPrefix?: string; // Novo: Prefixo para o data-cy
  dataTestIdPrefix?: string; // Novo: Prefixo para o data-testid
}

const FilterBase: React.FC<FilterBaseProps> = ({
  options,
  selectedValues,
  onChange,
  filterType,
  getIcon,
  dataCyPrefix = "filter-option", // Prefixo padrão para data-cy
  dataTestIdPrefix = "filter-option", // Prefixo padrão para data-testid
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        const icon = getIcon ? getIcon(option) : null;

        const dataCy = `${dataCyPrefix}-${option}`;
        const dataTestId = `${dataTestIdPrefix}-${option}`;

        if (filterType === "button") {
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              data-cy={dataCy}
              data-testid={dataTestId}
              className={`flex items-center p-2 rounded-full border transition-all duration-300 ${
                isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {icon}
              <span className="ml-2 capitalize">{option}</span>
            </button>
          );
        } else if (filterType === "checkbox") {
          return (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onChange(option)}
                data-cy={dataCy}
                data-testid={dataTestId}
                className="form-checkbox"
              />
              {icon}
              <span className="ml-2 capitalize">{option}</span>
            </label>
          );
        } else {
          return (
            <span
              key={option}
              data-cy={dataCy}
              data-testid={dataTestId}
              className="flex items-center p-2 rounded bg-gray-100 text-gray-600 border border-gray-300"
            >
              {icon}
              <span className="ml-2 capitalize">{option}</span>
            </span>
          );
        }
      })}
    </div>
  );
};

export default FilterBase;
