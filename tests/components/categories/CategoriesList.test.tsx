import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CategoriesPage from '@/app/categories/page'; // Import the component
import { checkAuth } from '@/lib/auth'; // Mock checkAuth function

// Mock the checkAuth function and the global fetch
jest.mock('@/lib/auth', () => ({
  checkAuth: jest.fn(),
}));

describe('CategoriesPage Component', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn();
    // Mock document.cookie to simulate token presence
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'authToken=valid-token',
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('displays categories from API', async () => {
    // Mock the authentication check to resolve as authenticated
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);

    // Mock the fetch response to return predefined categories
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true, // Explicitly set the 'ok' property
      json: jest.fn().mockResolvedValueOnce({
        success: true,
        categories: [
          { _id: '1', name: 'Work' },
          { _id: '2', name: 'Personal' },
        ],
      }),
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
    // Mock the authentication check to resolve as authenticated
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);

    // Mock a failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false, // Simulate failed response
      statusText: 'Failed to fetch categories',
    });

    // Use act to ensure all updates are handled correctly
    await act(async () => {
      render(<CategoriesPage />);
    });

    // Ensure no categories were fetched
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Personal')).not.toBeInTheDocument();
  });

  it('allows adding a new category', async () => {
    // Mock the authentication check to resolve as authenticated
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);

    // Mock the fetch responses:
    // - The first mock for fetching the initial categories (empty)
    // - The second mock for adding a new category
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          categories: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          category: { _id: '3', name: 'New Category' },
        }),
      });

    // Use act to ensure all updates are handled correctly
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
