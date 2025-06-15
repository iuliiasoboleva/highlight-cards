import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export const fetchManagers = createAsyncThunk('managers/fetchManagers', async (orgId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/employees', { params: { organization_id: orgId } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const managersSlice = createSlice({
  name: 'managers',
  initialState: {
    list: [],
    loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addManager, removeManager, updateManager, assignManagerToSalesPoint } = managersSlice.actions;
export default managersSlice.reducer;
