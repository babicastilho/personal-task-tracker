/* eslint-disable react/display-name */
import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '@/app/page';
import { checkAuth } from '@/lib/auth';

// Mock the checkAuth function
jest.mock('@/lib/auth', () => ({
  checkAuth: jest.fn(),
}));

// Mock the Dashboard and SignIn components
jest.mock('@/components/Dashboard', () => {
  return () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Welcome, </h2>
    </div>
  );
});

jest.mock('@/components/SignIn', () => {
  return () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
    </div>
  );
});

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SignIn component when not authenticated', async () => {
    (checkAuth as jest.Mock).mockResolvedValueOnce(false);
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  it('renders Dashboard component when authenticated', async () => {
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText('Welcome,')).toBeInTheDocument();
    });
  });
});
