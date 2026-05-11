import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';

const mockPeople = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
  },
];

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ results: mockPeople }),
      })
    );
  });

  test('renders application layout', async () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText(/enter search term/i)
    ).toBeInTheDocument();
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });
});
