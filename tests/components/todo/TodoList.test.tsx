import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TodoList from "@/components/TodoList";
import { apiFetch } from "@/lib/apiFetch";

// Mock the apiFetch function
jest.mock("@/lib/apiFetch", () => ({
  apiFetch: jest.fn(),
}));

const mockTasks = [
  {
    _id: "1",
    title: "Task 1",
    completed: false,
    priority: "medium",
    dueDate: "2024-12-30",
    dueTime: "14:00",
  },
  {
    _id: "2",
    title: "Task 2",
    completed: true,
    priority: "medium",
    dueDate: "2024-12-31",
    dueTime: "15:00",
  },
  {
    _id: "3",
    title: "Task 3",
    completed: false,
    priority: "medium",
    dueDate: "2024-12-29",
    dueTime: "16:00",
  },
];

const mockCategories = [
  { _id: "1", name: "Work" },
  { _id: "2", name: "Personal" },
];

beforeEach(() => {
  jest.clearAllMocks();

  // Mock the apiFetch calls based on the URL
  (apiFetch as jest.Mock).mockImplementation((url: string, options?: any) => {
    if (url.includes("/categories")) {
      return Promise.resolve({ success: true, categories: mockCategories });
    }

    if (url.includes("/tasks")) {
      if (options?.method === "POST") {
        // Mock the response for adding a new task
        return Promise.resolve({
          success: true,
          task: {
            _id: "4",
            title: "New Task",
            completed: false,
            priority: "medium",
            dueDate: "2024-12-31",
            dueTime: "14:00",
          },
        });
      }

      if (options?.method === "PUT") {
        // Mock the response for toggling task completion
        const taskId = url.split("/").pop();
        const taskIndex = mockTasks.findIndex(t => t._id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = {
            ...mockTasks[taskIndex],
            completed: !mockTasks[taskIndex].completed, // Toggle the completion state
          };

          // Update the task in mockTasks
          mockTasks[taskIndex] = updatedTask;

          return Promise.resolve({
            success: true,
            task: updatedTask,
          });
        }
      }

      // Return the mock tasks for the GET request
      return Promise.resolve({ success: true, tasks: mockTasks });
    }

    return Promise.reject(new Error("Unknown API endpoint"));
  });
});

describe("TodoList Component", () => {
  // Test for rendering the initial tasks
  it("should render the initial tasks", async () => {
    render(<TodoList />);

    // Wait for the tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Task 1/)).toBeInTheDocument();
      expect(screen.getByText(/Task 2/)).toBeInTheDocument();
      expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    });
  });

  it("should add a new task with date and time", async () => {
    render(<TodoList />);

    // Wait for the task input to be rendered
    await waitFor(() => expect(screen.getByTestId("task-input")).toBeInTheDocument());

    // Simulate adding a new task
    await act(async () => {
      fireEvent.change(screen.getByTestId("task-input"), { target: { value: "New Task" } });
      fireEvent.change(screen.getByTestId("date-input"), { target: { value: "2024-12-31" } });
      fireEvent.change(screen.getByTestId("time-input"), { target: { value: "14:00" } });
      fireEvent.click(screen.getByTestId("add-task-button"));
    });

    // Check if the new task was added with due date and time
    expect(await screen.findByText(/New Task/i)).toBeInTheDocument();
    expect(await screen.findByText(/Due Date: 31\/12\/2024 at 14:00/i)).toBeInTheDocument();
  });

  it("should toggle task completion by clicking on the entire list item", async () => {
    render(<TodoList />);
  
    const taskItem = await screen.findByTestId("task-1");
    expect(taskItem).toBeInTheDocument();
  
    const taskLi = taskItem.closest("li");
    expect(taskLi).toBeInTheDocument();
    expect(taskLi).not.toHaveClass("line-through"); // Verifica que não tem a classe de riscado inicialmente
  
    // Toggle task completion by clicking the entire <li>
    await act(async () => {
      fireEvent.click(taskLi);
    });
  
    // Verifica se a classe foi aplicada corretamente após o primeiro clique
    await waitFor(() => {
      const updatedTaskItem = screen.getByTestId("task-1");
      const updatedTaskLi = updatedTaskItem.closest("li");
      expect(updatedTaskLi).toHaveClass("line-through"); // Verifica que a classe de riscado foi aplicada
    });
  
    // Toggle task completion back by clicking the <li> again
    await act(async () => {
      fireEvent.click(taskLi);
    });
  
    // Verifica se a classe foi removida após o segundo clique
    await waitFor(() => {
      const updatedTaskItem = screen.getByTestId("task-1");
      const updatedTaskLi = updatedTaskItem.closest("li");
      expect(updatedTaskLi).not.toHaveClass("line-through"); // Verifica que a classe de riscado foi removida
    });
  });   

  // Test for removing a task
  it("should remove a task", async () => {
    render(<TodoList />);

    // Wait for the tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    });

    // Simulate task removal
    fireEvent.click(screen.getByLabelText("remove-1"));

    // Ensure the task is no longer rendered
    await waitFor(() => {
      expect(screen.queryByText(/Task 1/)).not.toBeInTheDocument();
    });
  });

  // Test for preventing adding a task with a past date
  it("should not allow adding a task with a past date", async () => {
    render(<TodoList />);

    // Wait for the input field
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter new task")).toBeInTheDocument();
    });

    // Simulate adding a task with a past due date
    fireEvent.change(screen.getByPlaceholderText("Enter new task"), {
      target: { value: "Old Task" },
    });
    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "2020-01-01" },
    });
    fireEvent.change(screen.getByTestId("time-input"), {
      target: { value: "14:00" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    // Ensure the task is not added
    expect(screen.queryByText("Old Task")).not.toBeInTheDocument();
  });
});
