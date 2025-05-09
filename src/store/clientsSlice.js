import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      return action.payload;
    },
    addClient: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setClients, addClient } = clientsSlice.actions;
export default clientsSlice.reducer;
