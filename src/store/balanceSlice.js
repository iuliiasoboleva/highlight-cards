import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async (orgId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/balance', { params: { organization_id: orgId } });
      return res.data.balance;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const topUpBalance = createAsyncThunk(
  'balance/topUpBalance',
  async ({ orgId, amount }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/balance/top-up', {
        organization_id: orgId,
        amount,
      });
      return res.data.balance;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    amount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(topUpBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topUpBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload;
      })
      .addCase(topUpBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default balanceSlice.reducer; 