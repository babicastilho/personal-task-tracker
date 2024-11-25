import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CategoriesPage from '@/app/categories/page'; // Import the component
import { apiFetch } from '@/lib/apiFetch'; // Import the function to mock
import { useAuth } from '@/hooks/useAuth'; // Mock the authentication hook

// Mock the apiFetch function and useAuth hook
jest.mock('@/lib/apiFetch');
jest.mock('@/hooks/useAuth');

// Mock i18n translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "categories.errorFetchingCategories": "Failed to fetch categories.",
        "categories.manageCategories": "Manage Categories",
        "categories.categoryNamePlaceholder": "Category name",
        "categories.categoryDescriptionPlaceholder": "Category description",
        "categories.addCategoryButton": "Add Category",
      };
      return translations[key] || key;
    },
  }),
}));

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
    // Mock authentication to simulate an authenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });
  
    // Mock a failed fetch response
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      success: false,
    });
  
    // Render the component
    await act(async () => {
      render(<CategoriesPage />);
    });
  
    // Ensure the error message is displayed
    expect(screen.getByText('Error fetching categories.')).toBeInTheDocument();
  });

  it('allows adding a new category', async () => {
    // Mock authentication to simulate an authenticated user
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });
  
    // Mock API calls
    (apiFetch as jest.Mock).mockImplementation((url, options) => {
      console.log('Mock API Call:', { url, options }); // Log mock calls
      if (options.method === 'GET') {
        return Promise.resolve({ success: true, categories: [] });
      }
      if (options.method === 'POST') {
        console.log('POST Request Body:', options.body); // Log POST body
        return Promise.resolve({ success: true, category: { _id: '3', name: 'New Category' } });
      }
      return Promise.resolve({ success: false });
    });
  
    // Render the component
    await act(async () => {
      render(<CategoriesPage />);
    });
  
    // Ensure the initial state is empty
    expect(screen.getByTestId('category-list-items')).toBeInTheDocument();
    expect(screen.queryByTestId('category-name-3')).not.toBeInTheDocument();
  
    // Simulate user input and button click
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByPlaceholderText('Category description'), { target: { value: 'Description' } });
    fireEvent.click(screen.getByText('Add Category'));
  
    console.log('Waiting for new category...');
    await waitFor(() => {
      screen.debug(); // Output the DOM for debugging
      const addedCategory = screen.getByTestId('category-name-3');
      expect(addedCategory).toBeInTheDocument();
      expect(addedCategory).toHaveTextContent('New Category');
    });
    console.log('New category added!');
  }, 10000); // Increased timeout to 10 seconds
    
});
