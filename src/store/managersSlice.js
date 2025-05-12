import { createSlice } from '@reduxjs/toolkit';

import { initialManagers } from '../mocks/managersInfo';

const managersSlice = createSlice({
  name: 'managers',
  initialState: initialManagers,
  reducers: {
    addManager: (state, action) => {
      state.push({ ...action.payload, id: Date.now() });
    },
    removeManager: (state, action) => {
      return state.filter((manager) => manager.id !== action.payload);
    },
    updateManager: (state, action) => {
      const index = state.findIndex((manager) => manager.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    assignManagerToSalesPoint: (state, action) => {
      const { managerId, salesPointName } = action.payload;
      const manager = state.find((m) => m.id === managerId);

      if (manager) {
        if (!manager.locations) manager.locations = [];
        if (!manager.locations.includes(salesPointName)) {
          manager.locations.push(salesPointName);
        }
      }
    },
  },
});

export const { addManager, removeManager, updateManager, assignManagerToSalesPoint } =
  managersSlice.actions;
export default managersSlice.reducer;
