import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from '../pages/properties/propertySlice';
import searchReducer from '../pages/search/searchSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
