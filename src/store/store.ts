import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import selectedItemsReducer from './selectedItems/selectedItemsSlice';
import { peopleApi } from './api/peopleApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [peopleApi.reducerPath]: peopleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(peopleApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
