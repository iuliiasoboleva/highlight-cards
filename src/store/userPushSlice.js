import { createSlice } from '@reduxjs/toolkit';

import { userPushNotificationsMock } from '../mocks/mockUserPushes';

const initialState = {
  items: userPushNotificationsMock.map((push) => ({
    ...push,
    message: push.message ?? push.defaultMessage ?? '',
    selectedCards: Array.isArray(push.selectedCards) ? push.selectedCards : [],
    delay: typeof push.delay === 'number' ? push.delay : 0,
  })),
};

const userPushSlice = createSlice({
  name: 'userPush',
  initialState,
  reducers: {
    setMessage(state, { payload: { id, message } }) {
      const pushItem = state.items.find((item) => item.id === id);
      if (pushItem) {
        pushItem.message = message;
      }
    },

    setDelay(state, { payload: { id, delay } }) {
      const pushItem = state.items.find((item) => item.id === id);
      if (pushItem) {
        pushItem.delay = delay;
      }
    },

    removeUserPush(state, { payload: id }) {
      state.items = state.items.filter((item) => item.id !== id);
    },

    addSelectedCard(state, { payload: { id, cardId } }) {
      const pushItem = state.items.find((item) => item.id === id);
      if (!pushItem) return;

      if (!Array.isArray(pushItem.selectedCards)) {
        pushItem.selectedCards = [];
      }

      const cardAlreadySelected = pushItem.selectedCards.includes(cardId);
      if (!cardAlreadySelected) {
        pushItem.selectedCards.push(cardId);
      }
    },

    removeSelectedCard(state, { payload: { id, cardId } }) {
      const pushItem = state.items.find((item) => item.id === id);
      if (!pushItem || !Array.isArray(pushItem.selectedCards)) return;

      pushItem.selectedCards = pushItem.selectedCards.filter(
        (selectedCardId) => selectedCardId !== cardId,
      );
    },
  },
});

export const { setMessage, setDelay, removeUserPush, addSelectedCard, removeSelectedCard } =
  userPushSlice.actions;

export default userPushSlice.reducer;
