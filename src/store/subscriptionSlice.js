import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (orgId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/subscription', {
        params: { organization_id: orgId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    info: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer; 