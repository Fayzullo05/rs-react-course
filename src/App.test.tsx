import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';
import { store } from './store/store';
import { peopleApi } from './store/api/peopleApi';
import { ThemeProvider } from './context/theme/themeProvider';

const mockPeople = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
  },
];

const createFetchResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderApp = (initialRoute = '/') => {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    store.dispatch(peopleApi.util.resetApiState());

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({
          info: {
            pages: 3,
          },
          results: mockPeople,
        })
      )
    );
  });

  test('renders main page by default', async () => {
    renderApp();

    expect(screen.getByRole('link', { name: /main/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  test('renders about page route', () => {
    renderApp('/about');

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/fayzullaxon sharipxanov/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /rs school react course/i })
    ).toBeInTheDocument();
  });

  test('renders not found page for unknown route', () => {
    renderApp('/unknown-page');

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /return to main page/i })
    ).toBeInTheDocument();
  });
});
