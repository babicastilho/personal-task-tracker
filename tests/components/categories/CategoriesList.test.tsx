import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoriesPage from '@/app/categories/page'; // Import the component
import { checkAuth } from '@/lib/auth'; // Mock checkAuth function

jest.mock('@/lib/auth', () => ({
  checkAuth: jest.fn(),
}));

describe('CategoriesPage Component', () => {
  it('shows loading initially', () => {
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);
    render(<CategoriesPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays categories from API', async () => {
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);
    render(<CategoriesPage />);
    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });
  });

  it('allows adding a new category', async () => {
    (checkAuth as jest.Mock).mockResolvedValueOnce(true);
    render(<CategoriesPage />);
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByPlaceholderText('Category description'), { target: { value: 'Description' } });
    fireEvent.click(screen.getByText('Add Category'));
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
    });
  });
});
