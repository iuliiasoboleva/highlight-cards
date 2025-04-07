import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  description: 'Собирайте штампы для получения наград',
  howToGetStamp: 'Сделайте покупку, чтобы получить штамп',
  companyName: '',
  rewardDescription: '',
  stampMessage: '',
  stampsLeftMessage: 'Всего (!) осталось до получения награды!',
  rewardMessage: '',
  claimRewardMessage: 'Ваша награда ждет вас! Приходите за получением подарка',
  inactiveMessage: 'Собирайте штампы для получения наград',
  activationMessage: 'Пока карта не активирована, вы можете выдать до 10 карт клиентам',
};

export const cardInfoSlice = createSlice({
  name: 'cardInfo',
  initialState,
  reducers: {
    updateCardInfo: (state, action) => {
      // Обновляем только переданные поля
      return { ...state, ...action.payload };
    },
    resetCardInfo: () => initialState,
  },
});

export const { updateCardInfo, resetCardInfo } = cardInfoSlice.actions;
export default cardInfoSlice.reducer;
