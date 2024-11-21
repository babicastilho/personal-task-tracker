// FilterModal.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterModal from '@/components/filters/FilterModal';
import PriorityFilter from '@/components/filters/PriorityFilter';

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the translation key for testing
  }),
}));

describe('FilterModal Component', () => {
  const handleClose = jest.fn(); // Mock function to handle modal close
  const handleClearFilters = jest.fn(); // Mock function to handle filter clearing
  const handlePriorityChange = jest.fn(); // Mock function to handle priority change
  const selectedPriorities = ["high"]; // Default selected priority

  it('should render and display the modal', () => {
    render(
      <FilterModal onClose={handleClose} onClearFilters={handleClearFilters}>
        <PriorityFilter
          selectedPriorities={selectedPriorities}
          onPriorityChange={handlePriorityChange}
        />
      </FilterModal>
    );
    expect(screen.getByTestId('filter-modal')).toBeVisible();
    expect(screen.getByText('filters.title')).toBeInTheDocument(); // Updated to use the translation key
  });

  it('should call onClose when "No, just close" button is clicked in the confirmation modal', () => {
    render(
      <FilterModal onClose={handleClose} onClearFilters={handleClearFilters}>
        <PriorityFilter
          selectedPriorities={selectedPriorities}
          onPriorityChange={handlePriorityChange}
        />
      </FilterModal>
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByTestId('close-modal-button'));
    
    // Simulate confirmation modal interaction - click on 'No, just close'
    fireEvent.click(screen.getByTestId('cancel-clear-filters'));
    
    // Expect onClose to be called after cancellation
    expect(handleClose).toHaveBeenCalled();
  });

  it('should call onClearFilters and onClose when "Yes, clear filters" button is clicked in the confirmation modal', () => {
    render(
      <FilterModal onClose={handleClose} onClearFilters={handleClearFilters}>
        <PriorityFilter
          selectedPriorities={selectedPriorities}
          onPriorityChange={handlePriorityChange}
        />
      </FilterModal>
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByTestId('close-modal-button'));

    // Simulate confirmation modal interaction - click on 'Yes, clear filters'
    fireEvent.click(screen.getByTestId('confirm-clear-filters'));
    
    // Expect onClearFilters and onClose to be called
    expect(handleClearFilters).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('should call onClearFilters when Clear Filters button is clicked', () => {
    render(
      <FilterModal onClose={handleClose} onClearFilters={handleClearFilters}>
        <PriorityFilter
          selectedPriorities={selectedPriorities}
          onPriorityChange={handlePriorityChange}
        />
      </FilterModal>
    );
    fireEvent.click(screen.getByTestId('clear-filters-button'));
    expect(handleClearFilters).toHaveBeenCalled();
  });

  it('should allow selection change in PriorityFilter', () => {
    render(
      <FilterModal onClose={handleClose} onClearFilters={handleClearFilters}>
        <PriorityFilter
          selectedPriorities={selectedPriorities}
          onPriorityChange={handlePriorityChange}
        />
      </FilterModal>
    );
    fireEvent.click(screen.getByTestId('priority-filter-medium'));
    expect(handlePriorityChange).toHaveBeenCalledWith('medium');
  });
});
