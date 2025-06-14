import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export const fetchTariffs = createAsyncThunk('tariffs/fetchTariffs', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/tariffs');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const tariffsSlice = createSlice({
  name: 'tariffs',
  initialState: {
    plans: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTariffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTariffs.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchTariffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tariffsSlice.reducer; 