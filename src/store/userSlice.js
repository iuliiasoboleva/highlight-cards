import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../axiosInstance';
import BASE_URL from '../config';
import { eraseCookie } from '../cookieUtils';

const storedOrg = localStorage.getItem('orgId');
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
  timezone: 'Europe/Moscow',
  avatar: null,
  role: '',
  organization_id: storedOrg ? Number(storedOrg) : undefined,
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

export const fetchOrganization = createAsyncThunk(
  'user/fetchOrganization',
  async (orgId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/organizations/${orgId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateUserSettings = createAsyncThunk(
  'user/updateUserSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/user-settings/me', settings);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/auth/profile', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const changePin = createAsyncThunk('user/changePin', async (pin, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/auth/change-pin', { pin });
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.avatar_url;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (reasons, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/delete-account', reasons);
      return true;
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
      let avatarUrl = data.avatar_url || data.avatar;
      if (avatarUrl && avatarUrl.startsWith('/'))
        avatarUrl = BASE_URL.replace(/\/$/, '') + avatarUrl;
      let contact;
      if (data.extra_contacts !== undefined) {
        contact = data.extra_contacts;
      } else {
        contact = state.contact;
      }
      const newState = { ...state, ...data, firstName, lastName, avatar: avatarUrl, contact };

      if ('organization_id' in data) {
        newState.organization_id = data.organization_id ?? undefined;

        if (data.organization_id) {
          localStorage.setItem('orgId', data.organization_id);
        } else {
          localStorage.removeItem('orgId');
        }
      }

      return newState;
    },
    toggleRole: (state) => {
      state.role = state.role === 'employee' ? 'admin' : 'employee';
    },
    logout: (state) => {
      eraseCookie('userToken');
      localStorage.removeItem('orgId');
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
        let avatarUrl = data.avatar_url || data.avatar;
        if (avatarUrl && avatarUrl.startsWith('/'))
          avatarUrl = BASE_URL.replace(/\/$/, '') + avatarUrl;
        if (data.extra_contacts !== undefined) {
          state.contact = data.extra_contacts;
        }

        Object.assign(state, data, { firstName, lastName, avatar: avatarUrl });
        if (data.organization_id) {
          state.organization_id = data.organization_id;
          localStorage.setItem('orgId', data.organization_id);
        }
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
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { name, surname, phone, extra_contacts } = action.payload || {};
        if (name) state.firstName = name.split(' ')[0];
        if (surname !== undefined) state.lastName = surname;
        if (phone !== undefined) state.phone = phone;
        if (extra_contacts !== undefined) state.contact = extra_contacts;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        const url = action.payload.startsWith('/')
          ? BASE_URL.replace(/\/$/, '') + action.payload
          : action.payload;
        state.avatar = url;
      });
  },
});

export const { updateField, setAvatar, removeAvatar, setUser, logout, toggleRole } =
  userSlice.actions;

export default userSlice.reducer;
