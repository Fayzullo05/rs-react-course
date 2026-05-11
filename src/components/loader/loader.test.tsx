import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Loader from './loader';

describe('Loader', () => {
  test('renders loading message', () => {
    render(<Loader />);

    expect(screen.getByText(/loading results/i)).toBeInTheDocument();
  });

  test('renders spinner container', () => {
    const { container } = render(<Loader />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
