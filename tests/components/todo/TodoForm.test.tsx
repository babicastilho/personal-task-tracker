import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoForm from "@/components/tasks/TaskForm";

// Mock the apiFetch function
jest.mock("@/lib/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

// Mock react-i18next specific for this test
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "task.due_date": "Due date",
        "task.required_if_time": "is required if a time is set.",
        "task.name": "Task name",
        "task.required": "is required.",
        "task.resume": "Resume",
        "task.add_new": "Add New Task",
        "task.edit": "Edit Task",
        "task.untitled": "Untitled",
        "task.category": "Category",
        "task.priority": "Priority",
        "task.description": "Description",
        "task.save": "Save",
        "task.cancel": "Cancel",
        "task.delete": "Delete",
        "task.confirm_delete": "Are you sure you want to delete this task?",
        "task.delete_yes": "Yes, delete it",
        "task.delete_no": "No, cancel",
      };
      return translations[key] || key;
    },
  }),
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
      expect(timeInputError).toHaveTextContent("Due date is required if a time is set.");
    });

    // Ensure the task was not added
    expect(screen.queryByText("Task with Time Only")).not.toBeInTheDocument();
  });
});
