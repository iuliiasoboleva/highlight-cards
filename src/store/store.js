import { configureStore } from '@reduxjs/toolkit';

import cardsReducer from './cardsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    user: userReducer,
  },
});
