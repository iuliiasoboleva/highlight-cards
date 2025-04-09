import { configureStore } from '@reduxjs/toolkit';

import cardDesignReducer from './cardDesignSlice';
import cardInfoReducer from './cardInfoSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    cardDesign: cardDesignReducer,
    cardInfo: cardInfoReducer,
    user: userReducer,
  },
});
