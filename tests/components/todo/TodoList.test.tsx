// tests/components/todo/TodoList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList, { Task } from '@/components/TodoList';

const mockTasks: Task[] = [
  { _id: '1', title: 'Task 1', completed: false },
  { _id: '2', title: 'Task 2', completed: true },
  { _id: '3', title: 'Task 3', completed: false },
];

beforeEach(() => {
  // Mock the fetch function for the initial fetch
  global.fetch = jest.fn((url, options) => {
    if (url === '/api/tasks' && options?.method === 'GET') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, tasks: mockTasks }),
      });
    }

    if (url.startsWith('/api/tasks/') && options?.method === 'PUT') {
      const taskId = url.split('/').pop();
      const updatedTask = { ...mockTasks.find(task => task._id === taskId), completed: true };
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, task: updatedTask }),
      });
    }

    if (url.startsWith('/api/tasks/') && options?.method === 'DELETE') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      });
    }

    if (url === '/api/tasks' && options?.method === 'POST') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, task: { _id: '4', title: 'New Task', completed: false } }),
      });
    }

    return Promise.reject(new Error('Unknown request'));
  }) as jest.Mock;
});

describe('TodoList Component', () => {
  it('should render the initial tasks', async () => {
    render(<TodoList />);
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('should add a new task', async () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText('Enter new task'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('should toggle task completion', async () => {
    render(<TodoList />);
    const task = await screen.findByText('Task 1');
    expect(task).not.toHaveStyle('text-decoration: line-through');
    fireEvent.click(screen.getByLabelText('toggle-1'));
    await new Promise(resolve => setTimeout(resolve, 0)); // Add a small delay
    const updatedTask = await screen.findByText('Task 1');
    // Verify if the updated task is correctly styled
    expect(updatedTask).toHaveStyle('text-decoration: line-through');
  });

  it('should remove a task', async () => {
    render(<TodoList />);
    fireEvent.click(await screen.findByLabelText('remove-1'));
    await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay
    expect(await screen.queryByText('Task 1')).not.toBeInTheDocument();
  });
});
