import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchNetworks = createAsyncThunk(
  'networks/fetchNetworks',
  async (orgId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/networks', { params: { organization_id: orgId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createNetwork = createAsyncThunk(
  'networks/createNetwork',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/networks', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const editNetwork = createAsyncThunk(
  'networks/editNetwork',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      const res = await axiosInstance.put(`/networks/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteNetwork = createAsyncThunk(
  'networks/deleteNetwork',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/networks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const networksSlice = createSlice({
  name: 'networks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNetwork.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editNetwork.fulfilled, (state, action) => {
        const idx = state.list.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteNetwork.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.id !== action.payload);
      });
  },
});

export default networksSlice.reducer;
