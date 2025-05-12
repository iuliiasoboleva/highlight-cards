import { createSlice, nanoid } from '@reduxjs/toolkit';

import { mockLocations } from '../mocks/mockLocations';

const salesPointsSlice = createSlice({
  name: 'locations',
  initialState: mockLocations,
  reducers: {
    addLocation: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(location) {
        return {
          payload: {
            ...location,
            id: location.id ?? nanoid(),
            employees: location.employees ?? [],
          },
        };
      },
    },
    updateLocation(state, action) {
      const index = state.findIndex((loc) => loc.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeLocation(state, action) {
      return state.filter((loc) => loc.id !== action.payload);
    },
  },
});

export const { addLocation, updateLocation, removeLocation } = salesPointsSlice.actions;
export default salesPointsSlice.reducer;
