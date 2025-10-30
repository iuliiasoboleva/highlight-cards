import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';

export const fetchManagers = createAsyncThunk(
  'managers/fetchManagers',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const orgId =
        typeof forceRefresh === 'object' ? forceRefresh.orgId : state.user.organization_id;

      if (!orgId) return [];

      if (!forceRefresh && state.managers.list.length > 0 && !state.managers.loading) {
        return null;
      }

      const res = await axiosInstance.get('/managers', { params: { organization_id: orgId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createManager = createAsyncThunk(
  'managers/createManager',
  async (managerData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/employees', managerData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteManager = createAsyncThunk(
  'managers/deleteManager',
  async (empId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employees/${empId}`);
      return empId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const editManager = createAsyncThunk(
  'managers/editManager',
  async (manager, { rejectWithValue }) => {
    try {
      const { id, ...data } = manager;
      const res = await axiosInstance.put(`/employees/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const managersSlice = createSlice({
  name: 'managers',
  initialState: {
    list: [],
    loading: false,
    fetching: false,
    error: null,
  },
  reducers: {
    addManager: (state, action) => {
      state.list.push({ ...action.payload, id: Date.now() });
    },
    removeManager: (state, action) => {
      state.list = state.list.filter((m) => m.id !== action.payload);
    },
    updateManager: (state, action) => {
      const idx = state.list.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    assignManagerToSalesPoint: (state, action) => {
      const { managerId, salesPointName } = action.payload;
      const manager = state.list.find((m) => m.id === managerId);
      if (manager) {
        if (!manager.locations) manager.locations = [];
        if (!manager.locations.includes(salesPointName)) manager.locations.push(salesPointName);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state) => {
        if (state.list.length === 0) {
          state.loading = true;
        } else {
          state.fetching = true;
        }
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        if (action.payload === null) {
          state.loading = false;
          state.fetching = false;
          return;
        }
        state.loading = false;
        state.fetching = false;
        state.list = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.fetching = false;
        state.error = action.payload;
      })
      .addCase(createManager.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.fetching = false;
        state.list.push(action.payload);
      })
      .addCase(createManager.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      })
      .addCase(deleteManager.pending, (state) => {
        state.fetching = true;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.fetching = false;
        state.list = state.list.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteManager.rejected, (state) => {
        state.fetching = false;
      })
      .addCase(editManager.pending, (state) => {
        state.fetching = true;
      })
      .addCase(editManager.fulfilled, (state, action) => {
        state.fetching = false;
        const idx = state.list.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editManager.rejected, (state) => {
        state.fetching = false;
      });
  },
});

export const { addManager, removeManager, updateManager, assignManagerToSalesPoint } =
  managersSlice.actions;
export default managersSlice.reducer;
