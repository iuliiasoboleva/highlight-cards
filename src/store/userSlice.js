import { createSlice } from '@reduxjs/toolkit';

import { mockUserProfile } from '../mocks/mockUserProfile';

const initialState = {
  ...mockUserProfile,
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
    resetUser: () => initialState,
  },
});

export const { updateField, setAvatar, removeAvatar, resetUser } = userSlice.actions;
export default userSlice.reducer;
