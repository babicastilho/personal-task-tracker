// tests/components/TodoList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '@/components/TodoList';

describe('TodoList Component', () => {
  it('should render a list of todos', () => {
    render(<TodoList />);
    // Verifica se 'Task 1' está no documento
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    // Verifica se 'Task 2' está no documento
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should add a new task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Enter new task');
    const button = screen.getByText('Add Task');

    // Adiciona uma nova tarefa
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    // Verifica se a nova tarefa está no documento
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('should toggle the completion state of a task', () => {
    render(<TodoList />);
    const toggleButton = screen.getByLabelText('toggle-1');

    // Alterna o estado de conclusão da primeira tarefa
    fireEvent.click(toggleButton);

    // Verifica se a tarefa está marcada como concluída
    expect(screen.getByText('Task 1')).toHaveStyle('text-decoration: line-through');
  });

  it('should remove a task', () => {
    render(<TodoList />);
    const removeButton = screen.getByLabelText('remove-1');

    // Remove a primeira tarefa
    fireEvent.click(removeButton);

    // Verifica se a tarefa foi removida do documento
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });
});
