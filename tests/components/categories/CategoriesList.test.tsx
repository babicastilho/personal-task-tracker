import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CategoriesPage from '@/app/categories/page'; // Import the component
import { apiFetch } from '@/lib/apiFetch'; // Import the function to mock
import { useAuth } from '@/hooks/useAuth'; // Mock the authentication hook

// Mock the apiFetch function and useAuth hook
jest.mock('@/lib/apiFetch');
jest.mock('@/hooks/useAuth');

describe('CategoriesPage Component', () => {
  beforeEach(() => {
    // Mock document.cookie to simulate token presence
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'authToken=valid-token',
    });

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('displays categories from API', async () => {
    // Mock the authentication check to simulate the user being authenticated
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

    // Mock the apiFetch for the GET request
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      success: true,
      categories: [
        { _id: '1', name: 'Work' },
        { _id: '2', name: 'Personal' },
      ],
    });

    // Use act to ensure all updates are handled correctly
    await act(async () => {
      render(<CategoriesPage />);
    });

    // Wait for the categories to appear in the document
    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });
  });

  it('handles fetch failure gracefully', async () => {
    // Mock the authentication check to simulate the user being authenticated
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

    // Mock a failed fetch response
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      success: false,
    });

    // Use act to ensure all updates are handled correctly
    await act(async () => {
      render(<CategoriesPage />);
    });

    // Ensure the error message is displayed
    expect(screen.getByText('Failed to fetch categories.')).toBeInTheDocument();
  });

  it('allows adding a new category', async () => {
    // Mock the authentication check to simulate the user being authenticated
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

    // Mock the fetch responses:
    // - The first mock for fetching the initial categories (empty)
    // - The second mock for adding a new category
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({
        success: true,
        categories: [],
      })
      .mockResolvedValueOnce({
        success: true,
        category: { _id: '3', name: 'New Category' },
      });

    // Use act to ensure all updates are handled corretamente
    await act(async () => {
      render(<CategoriesPage />);
    });

    // Simulate user input and actions
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByPlaceholderText('Category description'), { target: { value: 'Description' } });
    fireEvent.click(screen.getByText('Add Category'));

    // Wait for the new category to appear in the document
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
    });
  });
});
