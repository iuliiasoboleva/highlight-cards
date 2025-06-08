import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import { eraseCookie } from '../cookieUtils';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: null,
  role: '',
  isLoading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    removeAvatar: (state) => {
      state.avatar = null;
    },
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    toggleRole: (state) => {
      state.role = state.role === 'employee' ? 'admin' : 'employee';
    },
    logout: (state) => {
      eraseCookie('authToken');
      return { ...initialState, token: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateField, setAvatar, removeAvatar, setUser, logout, toggleRole } =
  userSlice.actions;

export default userSlice.reducer;
