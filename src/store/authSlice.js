import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import { eraseCookie, getCookie, setCookie } from '../cookieUtils';

export const requestMagicLink = createAsyncThunk(
  'auth/requestMagicLink',
  async ({ email, inn, role, firstName, lastName }) => {
    await axiosInstance.post('auth/magic-link-request', {
      email,
      inn,
      role,
      firstName,
      lastName,
    });
    return { email };
  },
);

export const verifyPin = createAsyncThunk('auth/verifyPin', async ({ email, pin }) => {
  const res = await axiosInstance.post('auth/verify-pin', { email, pin });
  setCookie('authToken', res.data.token, 14);
  return res.data.token;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    token: getCookie('authToken') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      eraseCookie('authToken');
      state.token = null;
      state.email = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestMagicLink.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestMagicLink.fulfilled, (state, action) => {
        state.status = 'success';
        state.email = action.payload.email;
      })
      .addCase(requestMagicLink.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(verifyPin.fulfilled, (state, action) => {
        state.token = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
