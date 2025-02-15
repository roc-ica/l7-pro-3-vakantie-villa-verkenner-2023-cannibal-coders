import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from '../features/properties/propertySlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
