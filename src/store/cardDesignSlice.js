import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logo: null,
  icon: null,
  background: null,
  colors: {
    cardBackground: '#FFFFFF',
    centerBackground: '#F6F6F6',
    textColor: '#1F1E1F',
  },
};

export const cardDesignSlice = createSlice({
  name: 'cardDesign',
  initialState,
  reducers: {
    updateLogo: (state, action) => {
      state.logo = action.payload;
    },
    updateIcon: (state, action) => {
      state.icon = action.payload;
    },
    updateBackground: (state, action) => {
      state.background = action.payload;
    },
    updateColors: (state, action) => {
      state.colors = {
        ...state.colors,
        ...action.payload,
      };
    },
  },
});

export const { updateLogo, updateIcon, updateBackground, updateColors } = cardDesignSlice.actions;
export default cardDesignSlice.reducer;
