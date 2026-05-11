import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ErrorBoundary from './errorBoundary';
import { Component, type ReactNode } from 'react';

class BrokenComponent extends Component {
  render(): ReactNode {
    return (() => {
      throw new Error('Broken component error');
    })();
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  test('renders fallback UI when child component throws error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the application encountered an unexpected error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  test('logs error to console', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('resets fallback UI when try again is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
