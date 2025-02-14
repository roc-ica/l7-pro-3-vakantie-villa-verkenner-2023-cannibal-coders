import { configureStore } from '@reduxjs/toolkit';
import { propertyReducer, authReducer } from '../features';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    auth: authReducer,
    search: searchReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
