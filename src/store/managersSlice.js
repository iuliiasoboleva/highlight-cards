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
  },
});

export const { addManager, removeManager } = managersSlice.actions;
export default managersSlice.reducer;
