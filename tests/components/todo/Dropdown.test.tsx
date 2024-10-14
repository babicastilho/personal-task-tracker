// Dropdown.test.tsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import Dropdown from "@/components/Dropdown";
import { FaAngleUp, FaAngleDown, FaEquals, FaAngleDoubleUp, FaAngleDoubleDown } from 'react-icons/fa';

const priorityOptions = [
  { value: "highest", label: "Highest", icon: <FaAngleDoubleUp /> },
  { value: "high", label: "High", icon: <FaAngleUp /> },
  { value: "medium", label: "Medium", icon: <FaEquals /> },
  { value: "low", label: "Low", icon: <FaAngleDown /> },
  { value: "lowest", label: "Lowest", icon: <FaAngleDoubleDown /> }
];

const iconMap = {
  highest: <FaAngleDoubleUp />,
  high: <FaAngleUp />,
  medium: <FaEquals />,
  low: <FaAngleDown />,
  lowest: <FaAngleDoubleDown />
};

describe("Dropdown Component", () => {
  it("should open and display options when clicked", () => {
    const onSelect = jest.fn();

    render(
      <Dropdown
        options={priorityOptions.map(option => option.value)}
        selectedValue="high"
        onSelect={onSelect}
        iconMap={iconMap}
      />
    );

    const dropdownToggle = screen.getByTestId("dropdown-toggle");
    fireEvent.click(dropdownToggle);

    // Buscar por data-testid no contêiner para evitar múltiplos elementos
    const dropdownOptions = screen.getByTestId("dropdown-options");
    const highOption = within(dropdownOptions).getByText("High");
    expect(highOption).toBeInTheDocument();

    fireEvent.click(highOption);
    expect(onSelect).toHaveBeenCalledWith("high");
  });

  it("should close the dropdown after selecting an option", () => {
    const onSelect = jest.fn();

    render(
      <Dropdown
        options={priorityOptions.map(option => option.value)}
        selectedValue="high"
        onSelect={onSelect}
        iconMap={iconMap}
      />
    );

    const dropdownToggle = screen.getByTestId("dropdown-toggle");
    fireEvent.click(dropdownToggle);

    const dropdownOptions = screen.getByTestId("dropdown-options");
    const lowOption = within(dropdownOptions).getByText("Low");
    fireEvent.click(lowOption);

    expect(onSelect).toHaveBeenCalledWith("low");
    expect(screen.queryByTestId("dropdown-options")).toBeNull();
  });
});
