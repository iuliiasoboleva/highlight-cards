import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk(
  'clients/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const orgId = getState().user.organization_id;
      if (!orgId) return [];
      const res = await axiosInstance.get('/clients', { params: { organization_id: orgId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createClient = createAsyncThunk(
  'clients/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/clients', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.list = action.payload;
    },
    addClientLocal: (state, action) => {
      state.list.push(action.payload);
    },
    updateCard(state, action) {
      const { cardNumber, updates } = action.payload;
      const client = state.list.find((client) =>
        client.cards.some((card) => card.cardNumber === cardNumber),
      );
      if (!client) return;
      const card = client.cards.find((c) => c.cardNumber === cardNumber);
      if (!card) return;
      Object.assign(card, updates);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { setClients, addClientLocal, updateCard } = clientsSlice.actions;
export default clientsSlice.reducer;
