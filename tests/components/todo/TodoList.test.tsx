import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '@/components/TodoList';

describe('TodoList Component', () => {
  it('should render the initial tasks', () => {
    render(<TodoList />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('should add a new task', () => {
    render(<TodoList />);
    fireEvent.change(screen.getByPlaceholderText('Enter new task'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('should toggle task completion', () => {
    render(<TodoList />);
    const task = screen.getByText('Task 1');
    expect(task).not.toHaveStyle('text-decoration: line-through');
    fireEvent.click(screen.getByLabelText('toggle-1'));
    expect(task).toHaveStyle('text-decoration: line-through');
  });

  it('should remove a task', () => {
    render(<TodoList />);
    fireEvent.click(screen.getByLabelText('remove-1'));
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });
});
