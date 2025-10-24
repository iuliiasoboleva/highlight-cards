import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchBranches = createAsyncThunk(
  'locations/fetchBranches',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const orgId = typeof forceRefresh === 'object' ? forceRefresh.orgId : state.user.organization_id;
      
      if (!orgId) return [];
      
      if (!forceRefresh && state.locations.list.length > 0 && !state.locations.loading) {
        return null;
      }
      
      const res = await axiosInstance.get('/branches', { params: { organization_id: orgId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createBranch = createAsyncThunk(
  'locations/createBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/branches', branchData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const editBranch = createAsyncThunk(
  'locations/editBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const { id, ...data } = branchData;
      const res = await axiosInstance.put(`/branches/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteBranch = createAsyncThunk(
  'locations/deleteBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/branches/${branchId}`);
      return branchId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const salesPointsSlice = createSlice({
  name: 'locations',
  initialState: {
    list: [],
    loading: false,
    fetching: false,
    error: null,
  },
  reducers: {
    addLocation: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare(location) {
        return {
          payload: {
            ...location,
            id: location.id ?? nanoid(),
            employees: location.employees ?? [],
          },
        };
      },
    },
    updateLocation(state, action) {
      const idx = state.list.findIndex((l) => l.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeLocation(state, action) {
      state.list = state.list.filter((l) => l.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        if (state.list.length === 0) {
          state.loading = true;
        } else {
          state.fetching = true;
        }
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        if (action.payload === null) {
          state.loading = false;
          state.fetching = false;
          return;
        }
        state.loading = false;
        state.fetching = false;
        state.list = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.fetching = false;
        state.error = action.payload;
      })
      .addCase(createBranch.pending, (state) => {
        state.fetching = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.fetching = false;
        state.list.push(action.payload);
      })
      .addCase(createBranch.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(editBranch.pending, (state) => {
        state.fetching = true;
      })
      .addCase(editBranch.fulfilled, (state, action) => {
        state.fetching = false;
        const payloadId = action.payload.uuid || action.payload.id;
        const idx = state.list.findIndex((b) => {
          const branchId = b.uuid || b.id;
          return branchId === payloadId || String(branchId) === String(payloadId);
        });
        
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(editBranch.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.fetching = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.fetching = false;
        state.list = state.list.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state) => {
        state.fetching = false;
      });
  },
});

export const { addLocation, updateLocation, removeLocation } = salesPointsSlice.actions;
export default salesPointsSlice.reducer;
