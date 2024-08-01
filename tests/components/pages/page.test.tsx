import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '@/app/page';
import { checkAuth } from '@/lib/auth';

// Mock the checkAuth function
jest.mock('@/lib/auth', () => ({
  checkAuth: jest.fn(),
}));

// Mock the TodoList and SignIn components
jest.mock('@/components/TodoList', () => {
  const TodoList = () => <div>TodoList Component</div>;
  return TodoList;
});

jest.mock('@/components/SignIn', () => {
  const SignIn = () => <div>SignIn Component</div>;
  return SignIn;
});

describe('Home Page', () => {
  it('renders SignIn component when not authenticated', async () => {
    (checkAuth as jest.Mock).mockReturnValue(Promise.resolve(false));
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText('SignIn Component')).toBeInTheDocument();
    });
  });

  it('renders TodoList component when authenticated', async () => {
    (checkAuth as jest.Mock).mockReturnValue(Promise.resolve(true));
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const todoListComponents = screen.getAllByText('TodoList Component');
      expect(todoListComponents.length).toBeGreaterThan(0);
    });
  });
});
