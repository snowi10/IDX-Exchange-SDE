import { test, describe, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyFilters } from '../listings-page/components/property-filters/PropertyFilters';

describe('PropertyFilters', () => {
    test('display filters from user input', async () => {
        const mockFilters = { city: 'Irvine', beds: 3, baths: 4 }

        render(<PropertyFilters filters={mockFilters} />);

        expect(screen.getByDisplayValue('Irvine')).toBeInTheDocument();
        expect(screen.getByDisplayValue('3')).toBeInTheDocument();
        expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    });

    test('filter button', () => {
        const filteredText = 'Filtered';
        const mockFiltering = () => render(<div>{filteredText}</div>);

        render(<PropertyFilters onSubmit={mockFiltering} />);
        expect(screen.queryByText(filteredText)).not.toBeInTheDocument();

        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);
        expect(screen.getByText(filteredText)).toBeInTheDocument();

    });

    test('clear filters button', () => {
        const clearedText = 'Cleared';
        const mockClearingFilters = () => render(<div>{clearedText}</div>);

        render(<PropertyFilters onClearFilters={mockClearingFilters} />);
        expect(screen.queryByText(clearedText)).not.toBeInTheDocument();

        const clearFiltersButton = screen.getByText('Clear filters');
        fireEvent.click(clearFiltersButton);
        expect(screen.getByText(clearedText)).toBeInTheDocument();
    });
});