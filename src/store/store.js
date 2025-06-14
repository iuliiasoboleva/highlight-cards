import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import cardsReducer from './cardsSlice';
import clientsReducer from './clientsSlice';
import managersReducer from './managersSlice';
import salesPointsReducer from './salesPointsSlice';
import userReducer from './userSlice';
import tariffsReducer from './tariffsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
    user: userReducer,
    clients: clientsReducer,
    managers: managersReducer,
    locations: salesPointsReducer,
    tariffs: tariffsReducer,
  },
});
