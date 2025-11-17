import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import { eraseCookie, getCookie, setCookie } from '../cookieUtils';

const TOKEN_COOKIE = 'userToken';

export const requestMagicLink = createAsyncThunk(
  'auth/requestMagicLink',
  async (
    {
      email,
      inn,
      role,
      firstName,
      lastName,
      phone,
      referral,
      otherReferral,
      promo_code,
      sendEmail = true,
    },
    { rejectWithValue },
  ) => {
    const payload = { email };

    if (inn) payload.inn = inn;
    if (role) payload.role = role;
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    if (phone) payload.phone = phone;
    if (referral) payload.referral = referral;
    if (otherReferral) payload.otherReferral = otherReferral;
    if (promo_code) payload.promo_code = promo_code;

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
        setCookie(TOKEN_COOKIE, res.data.token, 14);
        localStorage.setItem('quickJwt', res.data.token);
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
    setCookie(TOKEN_COOKIE, res.data.token, 14);
    localStorage.setItem('quickJwt', res.data.token);
  }
  return res.data;
});

export const resetPinRequest = createAsyncThunk(
  'auth/resetPinRequest',
  async ({ email }, { rejectWithValue }) => {
    try {
      await axiosInstance.post('auth/reset-pin-request', { email });
      return true;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const resetPinConfirm = createAsyncThunk(
  'auth/resetPinConfirm',
  async ({ token, pin }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('auth/reset-pin-confirm', { token, new_pin: pin });
      if (res.data?.token) {
        setCookie('userToken', res.data.token, 14);
        localStorage.setItem('quickJwt', res.data.token);
      }
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const requestSmsCode = createAsyncThunk(
  'auth/requestSmsCode',
  async ({ phone, channel, preferPin }, { rejectWithValue }) => {
    try {
      const payload = { phone: phone.replace(/\D/g, '') };
      if (channel) payload.channel = channel;
      if (typeof preferPin === 'boolean') payload.prefer_pin = preferPin;
      const response = await axiosInstance.post('auth/sms-code-request', payload);
      return {
        phone,
        has_pin: response.data?.has_pin || false,
        token: response.data?.token || null,
        channel: response.data?.channel || channel || 'sms',
        email: response.data?.email || null,
      };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const verifySmsCode = createAsyncThunk(
  'auth/verifySmsCode',
  async ({ phone, code }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('auth/sms-code-verify', {
        phone: phone.replace(/\D/g, ''),
        code,
      });
      if (res.data?.token) {
        setCookie(TOKEN_COOKIE, res.data.token, 14);
        localStorage.setItem('quickJwt', res.data.token);
      }
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data || err.message;
      return rejectWithValue(msg);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    token: getCookie(TOKEN_COOKIE) || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      eraseCookie(TOKEN_COOKIE);
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
      })
      .addCase(resetPinConfirm.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(verifySmsCode.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(requestSmsCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestSmsCode.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(requestSmsCode.rejected, (state) => {
        state.status = 'idle';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
