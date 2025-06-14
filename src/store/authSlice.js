import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import { eraseCookie, getCookie, setCookie } from '../cookieUtils';

export const requestMagicLink = createAsyncThunk(
  'auth/requestMagicLink',
  async (
    { email, inn, role, firstName, lastName, phone, sendEmail = true },
    { rejectWithValue },
  ) => {
    const payload = { email };

    if (inn) payload.inn = inn;
    if (role) payload.role = role;
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    if (phone) payload.phone = phone;

    payload.sendEmail = sendEmail;

    try {
      const res = await axiosInstance.post('auth/magic-link-request', payload);
      return { email, token: res.data.token };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const verifyPin = createAsyncThunk(
  'auth/verifyPin',
  async ({ token, pin }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('auth/verify-pin', { token, pin });
      if (res.data?.token) {
        setCookie('userToken', res.data.token, 14);
      }
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const setPinThunk = createAsyncThunk('auth/setPin', async ({ token, pin }) => {
  const res = await axiosInstance.post('auth/set-pin', { token, pin });
  if (res.data?.token) {
    setCookie('userToken', res.data.token, 14);
  }
  return res.data;
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
      .addCase(verifyPin.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(setPinThunk.fulfilled, (state) => {
        state.status = 'success';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
