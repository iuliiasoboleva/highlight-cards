import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchNetworks = createAsyncThunk(
  'networks/fetchNetworks',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const orgId =
        typeof forceRefresh === 'object' ? forceRefresh.orgId : state.user.organization_id;

      if (!orgId) return [];

      if (!forceRefresh && state.networks.list.length > 0 && !state.networks.loading) {
        return null;
      }

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
    fetching: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworks.pending, (state) => {
        if (state.list.length === 0) {
          state.loading = true;
        } else {
          state.fetching = true;
        }
        state.error = null;
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        if (action.payload === null) {
          state.loading = false;
          state.fetching = false;
          return;
        }
        state.loading = false;
        state.fetching = false;
        state.list = action.payload;
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.loading = false;
        state.fetching = false;
        state.error = action.payload;
      })
      .addCase(createNetwork.pending, (state) => {
        state.fetching = true;
      })
      .addCase(createNetwork.fulfilled, (state, action) => {
        state.fetching = false;
        state.list.push(action.payload);
      })
      .addCase(createNetwork.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(editNetwork.pending, (state) => {
        state.fetching = true;
      })
      .addCase(editNetwork.fulfilled, (state, action) => {
        state.fetching = false;
        const idx = state.list.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editNetwork.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(deleteNetwork.pending, (state) => {
        state.fetching = true;
      })
      .addCase(deleteNetwork.fulfilled, (state, action) => {
        state.fetching = false;
        state.list = state.list.filter((n) => n.id !== action.payload);
      })
      .addCase(deleteNetwork.rejected, (state) => {
        state.fetching = false;
      });
  },
});

export default networksSlice.reducer;
