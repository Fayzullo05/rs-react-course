import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from './layout';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

const mockPeople = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
  },
];

const renderLayout = (initialRoute = '/') => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Layout />
      </MemoryRouter>
    </Provider>
  );
};

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          info: {
            pages: 3,
          },
          results: mockPeople,
        }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('fetches initial data on mount', async () => {
    renderLayout();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  test('reads saved search term from localStorage on mount', async () => {
    localStorage.setItem('searchTerm', 'morty');

    renderLayout();

    expect(screen.getByPlaceholderText(/enter search term/i)).toHaveValue(
      'morty'
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=morty',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  test('shows loading state while data is being fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    );

    renderLayout();

    expect(await screen.findByText(/loading results/i)).toBeInTheDocument();
  });

  test('saves search term to localStorage and fetches searched data', async () => {
    const user = userEvent.setup();

    renderLayout();

    await screen.findByText('Rick Sanchez');

    const input = screen.getByPlaceholderText(/enter search term/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.clear(input);
    await user.type(input, 'morty');
    await user.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('morty');

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=morty',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  test('trims search term before saving and fetching', async () => {
    const user = userEvent.setup();

    renderLayout();

    await screen.findByText('Rick Sanchez');

    const input = screen.getByPlaceholderText(/enter search term/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.clear(input);
    await user.type(input, '  rick  ');
    await user.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('rick');

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=1&name=rick',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  test('does not fetch again when search term is the same', async () => {
    const user = userEvent.setup();

    localStorage.setItem('searchTerm', 'rick');

    renderLayout();

    await screen.findByText('Rick Sanchez');

    const fetchMock = vi.mocked(globalThis.fetch);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('shows empty message when API returns 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
    );

    renderLayout();

    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
  });

  test('shows error message when API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    renderLayout();

    expect(
      await screen.findByText(
        /failed to load results. please check your connection or try again later/i
      )
    ).toBeInTheDocument();
  });

  test('shows error message when API response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      })
    );

    renderLayout();

    expect(
      await screen.findByText(
        /failed to load results. please check your connection or try again later/i
      )
    ).toBeInTheDocument();
  });

  test('fetches data for page from URL', async () => {
    renderLayout('/?page=2');

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=2',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  test('updates page when pagination button is clicked', async () => {
    const user = userEvent.setup();

    renderLayout();

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/?page=2',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  test('opens details route when result card is clicked', async () => {
    const user = userEvent.setup();

    renderLayout('/?page=2');

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /rick sanchez/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
