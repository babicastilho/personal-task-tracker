import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import TodoForm from "@/components/TodoForm";

// Mock the apiFetch function
jest.mock("@/lib/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

describe("TodoForm Component", () => {
  it("should not allow adding a task with a time but no date", async () => {
    render(<TodoForm />);

    // Wait until the form is fully loaded
    await waitFor(() => expect(screen.getByTestId("task-input")).toBeInTheDocument());

    // Fill only the time input, leaving the date input blank
    fireEvent.change(screen.getByTestId("task-input"), { target: { value: "Task with Time Only" } });
    fireEvent.change(screen.getByTestId("time-input"), { target: { value: "14:00" } });
    fireEvent.click(screen.getByTestId("add-task-button"));

    // Verify the specific error is displayed
    await waitFor(() => {
      const timeInputError = screen.getByTestId("date-input-error");
      expect(timeInputError).toBeInTheDocument();
      expect(timeInputError).toHaveTextContent("Please provide a due date if you set a time.");
    });
    
    // Ensure the task was not added
    expect(screen.queryByText("Task with Time Only")).not.toBeInTheDocument();
  });

  it("should not allow adding a task with a time but no date", async () => {
    render(<TodoForm />);

    // Wait until the form is fully loaded
    await waitFor(() => expect(screen.getByTestId("task-input")).toBeInTheDocument());

    // Fill only the time input, leaving the date input blank
    fireEvent.change(screen.getByTestId("task-input"), { target: { value: "Task with Time Only" } });
    fireEvent.change(screen.getByTestId("time-input"), { target: { value: "14:00" } });
    fireEvent.click(screen.getByTestId("add-task-button"));

    // Verify the specific error is displayed
    await waitFor(() => {
      const timeInputError = screen.getByTestId("date-input-error");
      expect(timeInputError).toBeInTheDocument();
      expect(timeInputError).toHaveTextContent("Please provide a due date if you set a time.");
    });
    
    // Ensure the task was not added
    expect(screen.queryByText("Task with Time Only")).not.toBeInTheDocument();
  });
});
