import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

  test('renders main page by default', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /main/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  test('renders about page route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/fayzullaxon sharipxanov/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /rs school react course/i })
    ).toBeInTheDocument();
  });

  test('renders not found page for unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-page']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /return to main page/i })
    ).toBeInTheDocument();
  });
});
