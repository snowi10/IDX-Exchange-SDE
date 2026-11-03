import { test, describe, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../listings-page/components/pagination/Pagination';

describe('Pagination', () => {
    // TODO: Fill in this test.
    // TODO: Provide arguments for Pagination component for test to work.
    const mockCurrentPage = 30; 
    const mockItemsPerPage = 20;
    const mockFirstPropertyNum = (mockItemsPerPage * mockCurrentPage) + 1;
    const mockLastPropertyNum = (mockCurrentPage + 1) * mockItemsPerPage;
    const mockTotalProperties = 1000;

    test('first page button', () => {
        const firstPageText = 'On first page';
        const mockClickingPageButton = () => render(<div>{firstPageText}</div>);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} onPageClick={mockClickingPageButton} />);
        expect(screen.queryByText(firstPageText)).not.toBeInTheDocument();

        const firstPageButton = screen.getByText(1);
        fireEvent.click(firstPageButton);
        expect(screen.getByText(firstPageText)).toBeInTheDocument();
    })
    test('last page button', () => {
        const lastPageText = 'On last page';
        const mockClickingPageButton = () => render(<div>{lastPageText}</div>);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} onPageClick={mockClickingPageButton} />);
        expect(screen.queryByText(lastPageText)).not.toBeInTheDocument();
        
        const lastPageNumber = Math.ceil(mockTotalProperties/mockItemsPerPage);
        const lastPageButton = screen.getByText(lastPageNumber);
        fireEvent.click(lastPageButton);
        expect(screen.getByText(lastPageText)).toBeInTheDocument();
    })
    test('current page button', () => {
        const currentPageText = 'On current page';
        const mockClickingPageButton = () => render(<div>{currentPageText}</div>);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} onPageClick={mockClickingPageButton} />);
        expect(screen.queryByText(currentPageText)).not.toBeInTheDocument();

        const currentPageNumber = mockCurrentPage + 1;
        const currentPageButton = screen.getByText(currentPageNumber);
        fireEvent.click(currentPageButton);
        expect(screen.getByText(currentPageText)).toBeInTheDocument();
    })
    test('proceeding page button', () => {
        const proceedingPageText = 'On proceeding page';
        const mockClickingPageButton = () => render(<div>{proceedingPageText}</div>);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} onPageClick={mockClickingPageButton} />);
        expect(screen.queryByText(proceedingPageText)).not.toBeInTheDocument();

        const proceedingPageNumber = mockCurrentPage + 2;
        const proceedingPageButton = screen.getByText(proceedingPageNumber);
        fireEvent.click(proceedingPageButton);
        expect(screen.getByText(proceedingPageText)).toBeInTheDocument();

    })
    test('preceding page button', () => {
        const precedingPageText = 'On preceding page';
        const mockClickingPageButton = () => render(<div>{precedingPageText}</div>);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} onPageClick={mockClickingPageButton} />);
        expect(screen.queryByText(precedingPageText)).not.toBeInTheDocument();

        const precedingPageNumber = mockCurrentPage;
        const precedingPageButton = screen.getByText(precedingPageNumber);
        fireEvent.click(precedingPageButton);
        expect(screen.getByText(precedingPageText)).toBeInTheDocument();
    })
    test('ellipsis', () => {
        const lastPageNumber = Math.ceil(mockTotalProperties/mockItemsPerPage);
        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} />);
        expect(screen.getByText((_, element) => element.textContent === '1...')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === `...${lastPageNumber}`)).toBeInTheDocument();
    })
    test('no ellipsis', () => {
        const mockCurrentPage = 1;
        const mockItemsPerPage = 5;
        const mockFirstPropertyNum = (mockItemsPerPage * mockCurrentPage) + 1;
        const mockLastPropertyNum = (mockCurrentPage + 1) * mockItemsPerPage;
        const mockTotalProperties = 10;
        const lastPageNumber = Math.ceil(mockTotalProperties/mockItemsPerPage);

        render(<Pagination currentPage={mockCurrentPage} itemsPerPage={mockItemsPerPage} firstPropertyNum={mockFirstPropertyNum} lastPropertyNum={mockLastPropertyNum} totalProperties={mockTotalProperties} />);
        expect(screen.queryByText((_, element) => element.textContent === '1...')).not.toBeInTheDocument();
        expect(screen.queryByText((_, element) => element.textContent === `...${lastPageNumber}`)).not.toBeInTheDocument();
    })

})