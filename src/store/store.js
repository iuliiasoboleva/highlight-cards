import { configureStore } from '@reduxjs/toolkit';

import cardInfoReducer from './cardInfoSlice';
import cardsReducer from './cardsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    cardInfo: cardInfoReducer,
    user: userReducer,
  },
});
