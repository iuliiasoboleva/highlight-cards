import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import balanceReducer from './balanceSlice';
import cardsReducer from './cardsSlice';
import clientsReducer from './clientsSlice';
import managersReducer from './managersSlice';
import networksReducer from './networksSlice';
import paymentsReducer from './paymentsSlice';
import salesPointsReducer from './salesPointsSlice';
import subscriptionReducer from './subscriptionSlice';
import tariffsReducer from './tariffsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
    user: userReducer,
    clients: clientsReducer,
    managers: managersReducer,
    locations: salesPointsReducer,
    tariffs: tariffsReducer,
    payments: paymentsReducer,
    subscription: subscriptionReducer,
    networks: networksReducer,
    balance: balanceReducer,
  },
});
