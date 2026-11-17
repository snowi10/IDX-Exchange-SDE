import { test, expect, describe }  from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { errorBoundaryMessage } from '../common/errorBoundaryMessage';

const MockError = () => {
    throw new Error('error');
}

describe('error boundary', () => {
    test('show error boundary message', () => {
        render(<ErrorBoundary fallback={errorBoundaryMessage()}>
            <MockError />
        </ErrorBoundary>);

        expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });
});