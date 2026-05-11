import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Search from './search';

describe('Search', () => {
  test('renders search input and button', () => {
    render(<Search value="" onSearch={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/enter search term/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('shows initial value from props', () => {
    render(<Search value="rick" onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/enter search term/i)).toHaveValue(
      'rick'
    );
  });

  test('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<Search value="" onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/enter search term/i);

    await user.type(input, 'morty');

    expect(input).toHaveValue('morty');
  });

  test('calls onSearch with current input value when button is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search value="" onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/enter search term/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'summer');
    await user.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('summer');
  });

  test('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search value="" onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/enter search term/i);

    await user.type(input, 'beth');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('beth');
  });

  test('updates input when value prop changes', () => {
    const { rerender } = render(<Search value="rick" onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/enter search term/i);

    expect(input).toHaveValue('rick');

    rerender(<Search value="morty" onSearch={vi.fn()} />);

    expect(input).toHaveValue('morty');
  });
});
