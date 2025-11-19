import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (orgId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/subscription', {
        params: { organization_id: orgId },
      });
      return { data: res.data, orgId: orgId != null ? String(orgId) : null };
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
    orgId: null,
  },
  reducers: {
    resetSubscription: (state) => {
      state.info = null;
      state.loading = false;
      state.error = null;
      state.orgId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orgId = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.data;
        state.orgId = action.payload.orgId;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orgId = null;
      });
  },
});

export const { resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
