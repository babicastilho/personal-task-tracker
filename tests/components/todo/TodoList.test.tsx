import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import TodoList from "@/components/tasks/TodoList";
import { apiFetch } from "@/lib/apiFetch";

// Mock the apiFetch function
jest.mock("@/lib/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

const mockTasks = [
  {
    _id: "1",
    title: "Task 1",
    resume: "Short summary of task 1", // Include resume field
    completed: false,
    priority: "medium",
    dueDate: "2024-12-30",
    dueTime: "14:00",
  },
  {
    _id: "2",
    title: "Task 2",
    resume: "Short summary of task 2", // Include resume field
    completed: true,
    priority: "medium",
    dueDate: "2024-12-31",
    dueTime: "15:00",
  },
  {
    _id: "3",
    title: "Task 3",
    resume: "Short summary of task 3", // Include resume field
    completed: false,
    priority: "medium",
    dueDate: "2024-12-29",
    dueTime: "16:00",
  },
];

beforeEach(() => {
  jest.clearAllMocks();

  (apiFetch as jest.Mock).mockImplementation((url: string, options?: any) => {
    if (url.includes("/tasks")) {
      if (options?.method === "PUT") {
        // Mock the response for toggling task completion
        const taskId = url.split("/").pop();
        const taskIndex = mockTasks.findIndex((t) => t._id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = {
            ...mockTasks[taskIndex],
            completed: !mockTasks[taskIndex].completed,
          };

          mockTasks[taskIndex] = updatedTask;

          return Promise.resolve({
            success: true,
            task: updatedTask,
          });
        }
      }
      return Promise.resolve({ success: true, tasks: mockTasks });
    }
    return Promise.reject(new Error("Unknown API endpoint"));
  });
});

describe("TodoList Component", () => {
  it("should render the initial tasks", async () => {
    render(<TodoList />);

    // Wait for the tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Task 1/)).toBeInTheDocument();
      expect(screen.getByText(/Task 2/)).toBeInTheDocument();
      expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    });
  });

  it("should toggle task completion by clicking on the toggle button", async () => {
    render(<TodoList onAddTask={() => {}} onEditTask={() => {}} />);

    // Locate the toggle button using the updated data-testid
    const toggleButton = await screen.findByTestId("toggle-1");
    const taskTitle = await screen.findByTestId("task-title-1");

    expect(taskTitle).not.toHaveClass("line-through");

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(taskTitle).toHaveClass("line-through");
    });
  });
});
