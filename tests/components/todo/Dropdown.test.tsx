// Dropdown.test.tsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import Dropdown from "@/components/common/Dropdown";
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
        textTransform="capitalize"
      />
    );

    const dropdownToggle = screen.getByTestId("dropdown-toggle");
    fireEvent.click(dropdownToggle);

    const dropdownOptions = screen.getByTestId("dropdown-options");

    // Seleciona o botão exato com o texto "High" dentro do contêiner
    const highOption = within(dropdownOptions).getByRole("button", { name: "High" });
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
        textTransform="capitalize"
      />
    );

    const dropdownToggle = screen.getByTestId("dropdown-toggle");
    fireEvent.click(dropdownToggle);

    const dropdownOptions = screen.getByTestId("dropdown-options");

    // Seleciona o botão exato com o texto "Low" dentro do contêiner
    const lowOption = within(dropdownOptions).getByRole("button", { name: "Low" });
    fireEvent.click(lowOption);

    expect(onSelect).toHaveBeenCalledWith("low");
    expect(screen.queryByTestId("dropdown-options")).toBeNull();
  });
});
