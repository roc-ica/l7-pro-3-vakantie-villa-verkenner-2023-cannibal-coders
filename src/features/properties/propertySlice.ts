import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../types/property';

interface PropertyState {
  properties: Property[];
  loading: boolean;
}

const initialState: PropertyState = {
  properties: [],
  loading: false,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProperties, setLoading } = propertySlice.actions;
export default propertySlice.reducer;
