/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '@/app/page';
import { useAuth } from '@/hooks/useAuth'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter for mocking

// Mock the useAuth hook and useRouter
jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the Dashboard and SignIn components
jest.mock('@/components/dashboard', () => {
  return () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Welcome,</h2>
    </div>
  );
});

jest.mock('@/components/auth/SignIn', () => {
  return () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
    </div>
  );
});

describe('Home Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useRouter to prevent actual navigation
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders SignIn component when not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: false });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  it('renders Dashboard component when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

    await act(async () => {
      render(<Home />);
    });

    // Assert that push to /dashboard was called
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
