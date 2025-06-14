import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

import { mockCards } from '../mocks/cardData';
import { mockTemplateCards } from '../mocks/cardTemplatesData';
import { mergeCardWithDefault } from '../utils/mergeCardWithDefault';
import { statusConfig } from '../utils/statusConfig';

export const fixedCard = {
  id: 'fixed',
  title: 'Активна',
  status: 'fixed',
  isActive: true,
  isFixed: true,
  frameUrl: '/frame-empty.svg',
  name: 'Создать карту',
};

const getAllCards = (useTemplates = false) => {
  const source = useTemplates ? mockTemplateCards : mockCards;

  let sortedCards = [...source];
  sortedCards.sort((a, b) =>
    useTemplates
      ? a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' })
      : Number(b.isActive) - Number(a.isActive),
  );

  return [fixedCard, ...sortedCards];
};

const initialState = {
  cards: [],
  loading: true,
  error: null,
  currentCard: mergeCardWithDefault({}),
};

export const fetchCards = createAsyncThunk('cards/fetchCards', async (_, { getState, rejectWithValue }) => {
  try {
    const orgId = getState().user.organization_id;
    if (!orgId) return [];
    const res = await axiosInstance.get('/cards', { params: { organization_id: orgId } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = mergeCardWithDefault(action.payload);
    },

    updateCurrentCardField: (state, action) => {
      const { path, value } = action.payload;
      const keys = path.split('.');
      let target = state.currentCard;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) target[keys[i]] = {};
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      state.currentCard.updatedAt = new Date().toISOString();
    },

    addCurrentCardArrayItem: (state, action) => {
      const { path, item } = action.payload;
      const keys = path.split('.');
      let target = state.currentCard;
      for (let i = 0; i < keys.length; i++) {
        target = target[keys[i]];
      }
      if (Array.isArray(target)) {
        target.push(item);
        state.currentCard.updatedAt = new Date().toISOString();
      }
    },

    removeCurrentCardArrayItem: (state, action) => {
      const { path, index } = action.payload;
      const keys = path.split('.');
      let target = state.currentCard;
      for (let i = 0; i < keys.length; i++) {
        target = target[keys[i]];
      }
      if (Array.isArray(target)) {
        target.splice(index, 1);
        state.currentCard.updatedAt = new Date().toISOString();
      }
    },

    addCard: (state) => {
      const exists = state.cards.some(
        (card) => card.id !== 'fixed' && card.id === state.currentCard.id,
      );
      if (!exists) {
        state.cards.push({
          ...state.currentCard,
          createdAt: new Date().toISOString(),
          isActive: true,
        });
      }
    },

    updateCard: (state, action) => {
      const { id, changes } = action.payload;
      const index = state.cards.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.cards[index] = {
          ...state.cards[index],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteCard: (state, action) => {
      state.cards = state.cards.filter((c) => c.id !== action.payload);
    },

    copyCard: (state, action) => {
      const cardToCopy = state.cards.find((c) => c.id === action.payload);
      if (cardToCopy) {
        const newId =
          state.cards.reduce(
            (max, card) => (card.id !== 'fixed' && card.id > max ? card.id : max),
            0,
          ) + 1;

        const copiedCard = {
          ...mergeCardWithDefault(cardToCopy),
          id: newId,
          name: `${cardToCopy.name} (копия)`,
          isActive: false,
          createdAt: new Date().toISOString(),
        };

        state.cards.push(copiedCard);
      }
    },

    downloadCard: (state, action) => {
      const card = state.cards.find((c) => c.id === action.payload);
      if (card) {
        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(card, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', `card_${card.id}_${card.name}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
      }
    },

    initializeCards: (state, action) => {
      try {
        const useTemplates = action.payload?.useTemplates || false;
        state.cards = getAllCards(useTemplates).map((card) => ({
          ...card,
          fieldsName: (statusConfig[card.status] || []).map((item) => ({
            type: item.valueKey,
            name: item.label,
          })),
        }));
        state.error = null;
      } catch (err) {
        state.error = err.message;
        state.cards = [];
      } finally {
        state.loading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cards = [fixedCard];
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.cards = [fixedCard, ...action.payload].map((card) => ({
          ...card,
          fieldsName: (statusConfig[card.status] || []).map((item) => ({
            type: item.valueKey,
            name: item.label,
          })),
        }));
        state.loading = false;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cards = [fixedCard];
      });
  },
});

export const {
  setCurrentCard,
  updateCurrentCardField,
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
  addCard,
  updateCard,
  deleteCard,
  copyCard,
  downloadCard,
  initializeCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;
