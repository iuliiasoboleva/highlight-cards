import { configureStore } from '@reduxjs/toolkit';

import cardDesignReducer from './cardDesignSlice';
import cardInfoReducer from './cardInfoSlice';

export const store = configureStore({
  reducer: {
    cardDesign: cardDesignReducer,
    cardInfo: cardInfoReducer,
  },
});
