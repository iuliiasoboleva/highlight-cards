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
    updateCard(state, action) {
      const { cardNumber, updates } = action.payload;
      const client = state.find((client) =>
        client.cards.some((card) => card.cardNumber === cardNumber)
      );
      if (!client) return;
      const card = client.cards.find((c) => c.cardNumber === cardNumber);
      if (!card) return;
    
      Object.assign(card, updates);
    }
    
  },
});

export const { setClients, addClient, updateCard } = clientsSlice.actions;
export default clientsSlice.reducer;
