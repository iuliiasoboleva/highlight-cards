import { createSlice } from '@reduxjs/toolkit';

import { defaultCardTemplate } from '../components/defaultCardInfo';
import { mockCards } from '../mocks/cardData';
import { mockTemplateCards } from '../mocks/cardTemplatesData';

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

  let sortedCards;

  if (useTemplates) {
    sortedCards = [...source].sort((a, b) => {
      return a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' });
    });
  } else {
    sortedCards = [...source].sort((a, b) => {
      return Number(b.isActive) - Number(a.isActive);
    });
  }

  return [fixedCard, ...sortedCards];
};

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
    initializeCards: (state, action) => {
      state.loading = true;
      try {
        const useTemplates = action.payload?.useTemplates || false;
        state.cards = getAllCards(useTemplates);
        state.error = null;
      } catch (err) {
        state.error = err.message;
        state.cards = [];
      } finally {
        state.loading = false;
      }
    },

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
    setCurrentCardFromTemplate: (state, action) => {
      state.currentCard = {
        ...action.payload,
        id:
          state.cards.reduce(
            (max, card) => (card.id !== 'fixed' && card.id > max ? card.id : max),
            0,
          ) + 1,
        createdAt: new Date().toISOString(),
        isActive: false,
      };
    },

    addCard: (state) => {
      if (!state.currentCard.id || !state.currentCard.status) return;

      const exists = state.cards.some(
        (card) => card.id !== 'fixed' && card.id === state.currentCard.id,
      );

      if (!exists) {
        const newCard = {
          ...state.currentCard,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        state.cards.push(newCard);
      }
    },

    updateCurrentCard: (state, action) => {
      state.currentCard = {
        ...state.currentCard,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
    },

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

    updateCardById: (state, action) => {
      const { id, changes } = action.payload;
      const cardIndex = state.cards.findIndex((c) => c.id === id);
      if (cardIndex !== -1) {
        state.cards[cardIndex] = {
          ...state.cards[cardIndex],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    resetCurrentCard: (state) => {
      state.currentCard = { ...defaultCardTemplate };
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
          ...cardToCopy,
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
        console.log(`Downloading card ${card.id} (${card.name})`);

        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(card, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', `card_${card.id}_${card.name}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    },
    updateIssueFormField: (state, action) => {
      const { index, key, value } = action.payload;
      const updatedFields = state.currentCard.issueFormFields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field,
      );
      state.currentCard.issueFormFields = updatedFields;
    },
    addIssueFormField: (state) => {
      state.currentCard.issueFormFields.push({
        type: 'text',
        name: 'Текст',
        required: false,
        unique: false,
      });
    },
    removeIssueFormField: (state, action) => {
      const index = action.payload;
      state.currentCard.issueFormFields = state.currentCard.issueFormFields.filter(
        (_, i) => i !== index,
      );
    },
    addUtmLink: (state, action) => {
      const source = action.payload;
      const generatedUrl = `https://take.cards/${Math.random().toString(36).substr(2, 5)}`;
      state.currentCard.utmLinks.push({ source, url: generatedUrl });
    },
    removeUtmLink: (state, action) => {
      const index = action.payload;
      state.currentCard.utmLinks = state.currentCard.utmLinks.filter((_, i) => i !== index);
    },
    togglePolicyField: (state, action) => {
      const key = action.payload;
      state.currentCard.policySettings[key] = !state.currentCard.policySettings[key];
    },
    updatePolicyTextField: (state, action) => {
      const { key, value } = action.payload;
      state.currentCard.policySettings[key] = value;
    },
    updateIssueLimit: (state, action) => {
      state.currentCard.issueLimit = action.payload;
    },
    updateStatusField: (state, action) => {
      const { index, key, value } = action.payload;
      state.currentCard.statusFields[index][key] = value;
    },
    addStatusField: (state) => {
      state.currentCard.statusFields.push({ name: '', cost: '', percent: '' });
    },
    removeStatusField: (state, action) => {
      const index = action.payload;
      state.currentCard.statusFields = state.currentCard.statusFields.filter((_, i) => i !== index);
    },
    toggleRequirePurchaseAmount: (state) => {
      state.currentCard.requirePurchaseAmountOnAccrual =
        !state.currentCard.requirePurchaseAmountOnAccrual;
    },
    updateInitialPointsOnIssue: (state, action) => {
      state.currentCard.initialPointsOnIssue = action.payload;
    },
  },
});

export const {
  toggleRequirePurchaseAmount,
  updateInitialPointsOnIssue,
  updateStatusField,
  addStatusField,
  removeStatusField,
  updateIssueLimit,
  togglePolicyField,
  updatePolicyTextField,
  addUtmLink,
  removeUtmLink,
  updateIssueFormField,
  addIssueFormField,
  removeIssueFormField,
  initializeCards,
  initializeCurrentCard,
  setCurrentCardFromTemplate,
  addCard,
  updateCurrentCard,
  saveCurrentCard,
  resetCurrentCard,
  updateCardById,
  deleteCard,
  copyCard,
  downloadCard,
} = cardsSlice.actions;

export default cardsSlice.reducer;
