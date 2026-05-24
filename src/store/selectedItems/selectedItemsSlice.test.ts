import { describe, expect, test } from 'vitest';
import selectedItemsReducer, {
  clearSelectedItems,
  toggleSelectedItem,
} from './selectedItemsSlice';
import type { Person } from '../../types/person';

const mockPerson: Person = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
};

describe('selectedItemsSlice', () => {
  test('returns initial state', () => {
    const state = selectedItemsReducer(undefined, { type: 'unknown' });

    expect(state.items).toEqual([]);
  });

  test('adds item when it is not selected', () => {
    const state = selectedItemsReducer(
      { items: [] },
      toggleSelectedItem(mockPerson)
    );

    expect(state.items).toEqual([mockPerson]);
  });

  test('removes item when it is selected', () => {
    const state = selectedItemsReducer(
      { items: [mockPerson] },
      toggleSelectedItem(mockPerson)
    );

    expect(state.items).toEqual([]);
  });

  test('clears selected items', () => {
    const state = selectedItemsReducer(
      { items: [mockPerson] },
      clearSelectedItems()
    );

    expect(state.items).toEqual([]);
  });
});
