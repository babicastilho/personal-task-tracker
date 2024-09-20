import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from '@/components/TodoList';
import { apiFetch } from '@/lib/apiFetch'; // Import the function to mock

jest.mock('@/lib/apiFetch'); // Mock apiFetch

const mockTasks = [
  { _id: '1', title: 'Task 1', completed: false },
  { _id: '2', title: 'Task 2', completed: true },
  { _id: '3', title: 'Task 3', completed: false },
];

const mockCategories = [
  { _id: '1', name: 'Work' },
  { _id: '2', name: 'Personal' },
];

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should render the initial tasks', async () => {
    // Mock the apiFetch for the GET request for tasks and categories
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({ success: true, tasks: mockTasks })
      .mockResolvedValueOnce({ success: true, categories: mockCategories });

    render(<TodoList />);

    // Wait for the tasks to be rendered, using waitFor with a timeout
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });

  it('should add a new task', async () => {
    // Mock the apiFetch for the GET request for tasks and categories
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({ success: true, tasks: mockTasks })
      .mockResolvedValueOnce({ success: true, categories: mockCategories });

    // Mock the apiFetch for the POST request
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      success: true,
      task: { _id: '4', title: 'New Task', completed: false },
    });

    render(<TodoList />);

    // Wait for the input and button to be rendered
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter new task')).toBeInTheDocument();
    });

    // Add a new task
    fireEvent.change(screen.getByPlaceholderText('Enter new task'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Check that the new task is added
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('should toggle task completion', async () => {
    // Mock the apiFetch for the GET request for tasks and categories
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({ success: true, tasks: mockTasks })
      .mockResolvedValueOnce({ success: true, categories: mockCategories });

    // Mock the apiFetch for the PUT request
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      success: true,
      task: { _id: '1', title: 'Task 1', completed: true },
    });

    render(<TodoList />);

    // Wait for tasks to be rendered
    const task = await screen.findByText('Task 1');
    expect(task).not.toHaveStyle('text-decoration: line-through');

    // Simulate toggling task completion
    fireEvent.click(screen.getByLabelText('toggle-1'));

    // Wait for the state update
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toHaveStyle('text-decoration: line-through');
    });
  });

  it('should remove a task', async () => {
    // Mock the apiFetch for the GET request for tasks and categories
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({ success: true, tasks: mockTasks })
      .mockResolvedValueOnce({ success: true, categories: mockCategories });

    // Mock the apiFetch for the DELETE request
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<TodoList />);

    // Wait for the task to be rendered
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Simulate task deletion
    fireEvent.click(await screen.findByLabelText('remove-1'));

    // Wait for the state update
    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });
  });
});
