import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createBranch, fetchBranches } from './salesPointsSlice';

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
  frameUrl: '/phone.svg',
  name: 'Создать карту',
};

const getAllCards = (useTemplates = false) => {
  const source = useTemplates ? mockTemplateCards : mockCards;

  let sortedCards = [...source];
  sortedCards.sort((a, b) =>
    useTemplates
      ? /^[A-Za-z]/.test(a.name) && !/^[A-Za-z]/.test(b.name)
        ? -1
        : !/^[A-Za-z]/.test(a.name) && /^[A-Za-z]/.test(b.name)
          ? 1
          : a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' })
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

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (_, { getState, rejectWithValue }) => {
    try {
      const orgId = getState().user.organization_id;
      if (!orgId) return [];
      const res = await axiosInstance.get('/cards', { params: { organization_id: orgId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const saveCard = createAsyncThunk(
  'cards/saveCard',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentCard } = getState().cards;
      if (!currentCard?.id || currentCard.id === 'fixed') throw new Error('Нет id карты');
      const { frameUrl, ...rest } = currentCard;
      const payload = {
        ...rest,
        frame_url: frameUrl || 'phone.svg',
      };
      await axiosInstance.put(`/cards/${currentCard.id}`, payload);
      return { id: currentCard.id, changes: { pushNotification: currentCard.pushNotification } };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createCard = createAsyncThunk(
  'cards/createCard',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const { currentCard } = state.cards;
      const orgId = state.user.organization_id;
      if (!orgId) throw new Error('Нет organization_id');

      const { frameUrl, ...rest } = currentCard;
      const payload = {
        ...rest,
        frame_url: frameUrl || 'phone.svg',
        organization_id: orgId,
        is_active: false,
      };

      const res = await axiosInstance.post('/cards', payload);

      try {
        const links = currentCard?.infoFields?.activeLinks || [];
        const addrField = Array.isArray(links) ? links.find((f) => f?.type === 'address' && (f.text || '').trim()) : null;
        const addr = (addrField?.text || '').trim();
        const name = (currentCard?.infoFields?.companyName || currentCard?.name || '').trim();
        if (addr) {
          await dispatch(
            createBranch({
              name: name || addr,
              address: addr,
              organization_id: orgId,
            }),
          ).unwrap().catch(() => {});
          await dispatch(fetchBranches(orgId));
        }
      } catch (_) {}

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteCardAsync = createAsyncThunk(
  'cards/deleteCard',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cards/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const copyCardAsync = createAsyncThunk('cards/copyCard', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/cards/${id}/copy`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const renameCardAsync = createAsyncThunk(
  'cards/renameCard',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/cards/${id}`, { name });
      return { id, name };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const togglePinAsync = createAsyncThunk(
  'cards/togglePin',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      // toggle current status based on state
      const card = getState().cards.cards.find((c) => c.id === id);
      const newPinned = !card?.isPinned;
      await axiosInstance.put(`/cards/${id}`, { is_pinned: newPinned });

      // after toggling calculate new order and persist
      const orderedIds = getState()
        .cards.cards.filter((c) => c.id !== 'fixed' && c.id !== id)
        .map((c) => c.id);
      // we'll reinsert id at beginning if pinned else keep order
      const newOrder = newPinned ? [id, ...orderedIds] : orderedIds.filter((cid) => cid !== id);
      dispatch(saveOrder(newOrder));

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const saveOrder = createAsyncThunk('cards/saveOrder', async (order, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/cards/reorder', order);
    return order;
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

    reorderCards: (state, action) => {
      state.cards = action.payload;
    },

    togglePin: (state, action) => {
      const card = state.cards.find((c) => c.id === action.payload);
      if (!card || card.id === 'fixed') return;
      card.isPinned = !card.isPinned;
      const fixed = state.cards[0];
      const others = state.cards.slice(1);
      const pinned = others.filter((c) => c.isPinned);
      const rest = others.filter((c) => !c.isPinned);
      state.cards = [fixed, ...pinned, ...rest];
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
        const rawCards = [fixedCard, ...action.payload];

        const fixed = rawCards[0];
        const others = rawCards.slice(1);
        const pinned = others.filter((c) => c.isPinned);
        const rest = others.filter((c) => !c.isPinned);
        state.cards = [fixed, ...pinned, ...rest];
        state.loading = false;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cards = [fixedCard];
      })
      .addCase(saveCard.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(saveCard.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const idx = state.cards.findIndex((c) => c.id === id);
        if (idx !== -1) {
          state.cards[idx] = { ...state.cards[idx], ...changes };
        }
      })
      .addCase(createCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.loading = false;
        const rawCard = action.payload;
        const newCard = {
          ...rawCard,
          frameUrl: rawCard.frame_url || rawCard.frameUrl || '/frame-empty.svg',
          qrImg: rawCard.qr_img || rawCard.qrImg,
          urlCopy: rawCard.url_copy || rawCard.urlCopy,
        };
        const rest = state.cards.slice(1).filter((c) => c.id !== newCard.id);
        state.cards = [state.cards[0], ...rest, newCard];
        state.currentCard = mergeCardWithDefault(newCard);
      })
      .addCase(createCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCardAsync.fulfilled, (state, action) => {
        state.cards = state.cards.filter((c) => c.id !== action.payload);
      })
      .addCase(copyCardAsync.fulfilled, (state, action) => {
        const newCard = { ...action.payload, frameUrl: action.payload.frameUrl || 'phone.svg' };
        state.cards.push(newCard);
      })
      .addCase(renameCardAsync.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        const idx = state.cards.findIndex((c) => c.id === id);
        if (idx !== -1) {
          state.cards[idx].name = name;
        }
      })
      .addCase(togglePinAsync.fulfilled, (state, action) => {
        const id = action.payload;
        const fixed = state.cards[0];
        const others = state.cards.slice(1);
        const target = others.find((c) => c.id === id);
        if (!target) return;
        target.isPinned = !target.isPinned;
        const pinned = others.filter((c) => c.isPinned);
        const rest = others.filter((c) => !c.isPinned);
        state.cards = [fixed, ...pinned, ...rest];
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
  togglePin,
  reorderCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;
