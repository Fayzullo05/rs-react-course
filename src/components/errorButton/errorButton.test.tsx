import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import ErrorBoundary from '../errorBoundary/errorBoundary';
import ErrorButton from './errorButton';

describe('ErrorButton', () => {
  test('renders throw error button', () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();
  });

  test('shows error boundary fallback after button click', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the application encountered an unexpected error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });
});
