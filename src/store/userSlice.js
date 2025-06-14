import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import { eraseCookie } from '../cookieUtils';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  contact: '',
  dateFormat: 'DD/MM/YYYY',
  country: 'Russia',
  language: 'Russian',
  timezone: '(UTC+03:00) Moscow',
  avatar: null,
  role: '',
  isLoading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/users/me');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchOrganization = createAsyncThunk('user/fetchOrganization', async (orgId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/organizations/${orgId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

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
      const data = action.payload;
      let firstName;
      if (data.firstName !== undefined) {
        firstName = data.firstName;
      } else if (data.name) {
        firstName = data.name.split(' ')[0];
      } else {
        firstName = state.firstName;
      }
      let lastName;
      if (data.lastName !== undefined) {
        lastName = data.lastName;
      } else if (data.surname) {
        lastName = data.surname;
      } else if (data.name) {
        const parts = data.name.split(' ');
        lastName = parts.length > 1 ? parts.slice(1).join(' ') : state.lastName;
      } else {
        lastName = state.lastName;
      }
      return { ...state, ...data, firstName, lastName };
    },
    toggleRole: (state) => {
      state.role = state.role === 'employee' ? 'admin' : 'employee';
    },
    logout: (state) => {
      eraseCookie('userToken');
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
        const data = action.payload;
        let firstName;
        if (data.firstName !== undefined) {
          firstName = data.firstName;
        } else if (data.name) {
          firstName = data.name.split(' ')[0];
        } else {
          firstName = state.firstName;
        }
        let lastName;
        if (data.lastName !== undefined) {
          lastName = data.lastName;
        } else if (data.surname) {
          lastName = data.surname;
        } else if (data.name) {
          const parts = data.name.split(' ');
          lastName = parts.length > 1 ? parts.slice(1).join(' ') : state.lastName;
        } else {
          lastName = state.lastName;
        }

        Object.assign(state, data, { firstName, lastName });
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        if (action.payload?.name) {
          state.company = action.payload.name;
        }
      });
  },
});

export const { updateField, setAvatar, removeAvatar, setUser, logout, toggleRole } =
  userSlice.actions;

export default userSlice.reducer;
