import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: null,
  token: null,
  role: '',
  // добавь нужные поля, которые ты хочешь отслеживать
};

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
    logout: () => initialState,
  },
});

export const { updateField, setAvatar, removeAvatar, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
