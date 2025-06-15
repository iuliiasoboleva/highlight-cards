import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export const fetchBranches = createAsyncThunk('locations/fetchBranches', async (orgId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/branches', { params: { organization_id: orgId } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createBranch = createAsyncThunk('locations/createBranch', async (branchData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/branches', branchData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const editBranch = createAsyncThunk('locations/editBranch', async (branchData, { rejectWithValue }) => {
  try {
    const { id, ...data } = branchData;
    const res = await axiosInstance.put(`/branches/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteBranch = createAsyncThunk('locations/deleteBranch', async (branchId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/branches/${branchId}`);
    return branchId;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const salesPointsSlice = createSlice({
  name: 'locations',
  initialState: {
    list: [],
    loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editBranch.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
      });
  },
});

export const { addLocation, updateLocation, removeLocation } = salesPointsSlice.actions;
export default salesPointsSlice.reducer;
