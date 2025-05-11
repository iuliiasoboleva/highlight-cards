import { configureStore } from '@reduxjs/toolkit';

import cardsReducer from './cardsSlice';
import clientsReducer from './clientsSlice';
import userReducer from './userSlice';
import managersReducer from './managersSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    user: userReducer,
    clients: clientsReducer,
    managers: managersReducer,
  },
});
