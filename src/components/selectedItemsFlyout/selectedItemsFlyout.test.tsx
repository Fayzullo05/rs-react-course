import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, test, vi } from 'vitest';
import selectedItemsReducer from '../../store/selectedItems/selectedItemsSlice';
import SelectedItemsFlyout from './selectedItemsFlyout';

const mockPerson = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
};

function renderFlyout(selectedItems = [mockPerson]) {
  const store = configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      selectedItems: {
        items: selectedItems,
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <SelectedItemsFlyout />
      </Provider>
    ),
  };
}

describe('SelectedItemsFlyout', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('does not render when no items are selected', () => {
    renderFlyout([]);

    expect(screen.queryByText(/selected items/i)).not.toBeInTheDocument();
  });

  test('renders selected items count', () => {
    renderFlyout();

    expect(screen.getByText(/selected items/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('clears selected items when unselect all is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderFlyout();

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(store.getState().selectedItems.items).toEqual([]);
  });

  test('downloads selected items as csv', async () => {
    const user = userEvent.setup();

    const createObjectUrlMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:test-url');

    const revokeObjectUrlMock = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const clickMock = vi
      .spyOn<HTMLAnchorElement, 'click'>(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    renderFlyout();

    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(createObjectUrlMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:test-url');
  });
});
