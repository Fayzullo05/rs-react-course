import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import DetailsPage from './detailsPage';

const mockPerson = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: {
    name: 'Earth (C-137)',
  },
  location: {
    name: 'Citadel of Ricks',
  },
};

const renderDetailsPage = (initialRoute = '/details/1?page=2') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/" element={<div>Main page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DetailsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPerson,
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('fetches and renders character details', async () => {
    renderDetailsPage();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character/1',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  test('shows loading state while details are loading', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise(() => {
            // pending request
          })
      )
    );

    renderDetailsPage();

    expect(await screen.findByText(/loading results/i)).toBeInTheDocument();
  });

  test('shows error message when details request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    renderDetailsPage();

    expect(
      await screen.findByText(/failed to load character details/i)
    ).toBeInTheDocument();
  });

  test('closes details panel and keeps current page in URL', async () => {
    const user = userEvent.setup();

    renderDetailsPage('/details/1?page=2');

    await screen.findByText('Rick Sanchez');

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(await screen.findByText('Main page')).toBeInTheDocument();
  });
});
