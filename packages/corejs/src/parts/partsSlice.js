import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../inspections/inspectionsSlice';

export const partsAdapter = createEntityAdapter();

export const slice = createSlice({
  name: 'parts',
  initialState: partsAdapter.getInitialState({
    error: false,
    loading: 'idle',
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, (state, action) => {
      const { parts } = action.payload.entities;
      if (parts) { partsAdapter.upsertMany(state, parts); }
    });
  },
});

export default slice.reducer;