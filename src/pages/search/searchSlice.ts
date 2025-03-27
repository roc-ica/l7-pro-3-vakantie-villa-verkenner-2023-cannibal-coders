import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyFilter } from '../../types/property';

interface SearchState {
  filters: PropertyFilter;
  searchTerm: string;
}

const initialState: SearchState = {
  filters: {},
  searchTerm: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PropertyFilter>) => {
      state.filters = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    }
  }
});

export const { setFilters, setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
