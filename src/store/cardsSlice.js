import { createSlice } from '@reduxjs/toolkit';

import { defaultCardTemplate, mockCards } from '../mocks/cardData';

// Фиксированная карта для создания новых карт
export const fixedCard = {
  id: 'fixed',
  title: 'Активна',
  status: 'fixed',
  isActive: true,
  isFixed: true,
  frameUrl: '/frame-empty.svg',
  name: 'Создать карту',
};

// Функция для получения всех карт (фиксированная + моки)
const getAllCards = () => [fixedCard, ...mockCards];

const initialState = {
  cards: [],
  loading: true,
  error: null,
  currentCard: { ...defaultCardTemplate },
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    // Инициализация списка карт
    initializeCards: (state) => {
      state.loading = true;
      try {
        state.cards = getAllCards();
        state.error = null;
      } catch (err) {
        state.error = err.message;
        state.cards = [];
      } finally {
        state.loading = false;
      }
    },

    // Инициализация текущей карты
    initializeCurrentCard: (state) => {
      const maxId = state.cards.reduce(
        (max, card) => (card.id !== 'fixed' && card.id > max ? card.id : max),
        0,
      );
      state.currentCard = {
        ...defaultCardTemplate,
        id: maxId + 1,
      };
    },

    // Добавление новой карты
    addCard: (state) => {
      if (!state.currentCard.id || !state.currentCard.status) return;

      // Проверяем, не существует ли уже карта с таким ID
      const exists = state.cards.some(
        (card) => card.id !== 'fixed' && card.id === state.currentCard.id,
      );

      if (!exists) {
        const newCard = {
          ...state.currentCard,
          createdAt: new Date().toISOString(),
          isActive: true, // Новая карта активна по умолчанию
        };
        state.cards.push(newCard);
      }
    },

    // Обновление текущей карты
    updateCurrentCard: (state, action) => {
      state.currentCard = {
        ...state.currentCard,
        ...action.payload,
        updatedAt: new Date().toISOString(), // Добавляем метку времени
      };
    },

    // Сохранение текущей карты в список
    saveCurrentCard: (state) => {
      const index = state.cards.findIndex((card) => card.id === state.currentCard.id);
      if (index !== -1) {
        state.cards[index] = {
          ...state.currentCard,
          updatedAt: new Date().toISOString(),
        };
      } else {
        state.cards.push({
          ...state.currentCard,
          createdAt: new Date().toISOString(),
        });
      }
    },

    // Обновление дизайна
    updateCardDesign: (state, action) => {
      state.currentCard.design = {
        ...state.currentCard.design,
        ...action.payload,
      };
      state.currentCard.updatedAt = new Date().toISOString();
    },

    // Специфичные обновления дизайна
    updateLogo: (state, action) => {
      state.currentCard.design.logo = action.payload;
      state.currentCard.updatedAt = new Date().toISOString();
    },

    updateIcon: (state, action) => {
      state.currentCard.design.icon = action.payload;
      state.currentCard.updatedAt = new Date().toISOString();
    },

    updateBackground: (state, action) => {
      state.currentCard.design.background = action.payload;
      state.currentCard.updatedAt = new Date().toISOString();
    },

    updateColors: (state, action) => {
      state.currentCard.design.colors = {
        ...state.currentCard.design.colors,
        ...action.payload,
      };
      state.currentCard.updatedAt = new Date().toISOString();
    },

    // Сброс текущей карты
    resetCurrentCard: (state) => {
      state.currentCard = { ...defaultCardTemplate };
    },
  },
});

// Экспорт всех actions
export const {
  initializeCards,
  initializeCurrentCard,
  addCard,
  updateCurrentCard,
  saveCurrentCard,
  updateCardDesign,
  updateLogo,
  updateIcon,
  updateBackground,
  updateColors,
  resetCurrentCard,
} = cardsSlice.actions;

export default cardsSlice.reducer;
