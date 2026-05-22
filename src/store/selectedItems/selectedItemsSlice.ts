import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Person } from '../../types/person';

type SelectedItemsState = {
  items: Person[];
};

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem: (state, action: PayloadAction<Person>) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (existingItem) {
        state.items = state.items.filter(
          (selectedItem) => selectedItem.id !== item.id,
        );
        return;
      }

      state.items.push(item);
    },

    clearSelectedItems: (state) => {
      state.items = [];
    },
  },
});

export const { toggleSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;

