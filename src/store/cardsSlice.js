import { createSlice } from '@reduxjs/toolkit';

import { defaultCardTemplate } from '../components/defaultCardInfo';
import { mockCards } from '../mocks/cardData';
import { mockTemplateCards } from '../mocks/cardTemplatesData';

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
    // Инициализация списка карт
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
    setCurrentCardFromTemplate: (state, action) => {
      state.currentCard = {
        ...action.payload,
        id:
          state.cards.reduce(
            (max, card) => (card.id !== 'fixed' && card.id > max ? card.id : max),
            0,
          ) + 1, // присваиваем новый id
        createdAt: new Date().toISOString(),
        isActive: false, // копия шаблона пока не активна
      };
    },

    // Добавление новой карты
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

    // Обновление текущей карты
    updateCurrentCard: (state, action) => {
      state.currentCard = {
        ...state.currentCard,
        ...action.payload,
        updatedAt: new Date().toISOString(),
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

    // Сброс текущей карты
    resetCurrentCard: (state) => {
      state.currentCard = { ...defaultCardTemplate };
    },

    // Удаление карты
    deleteCard: (state, action) => {
      state.cards = state.cards.filter((c) => c.id !== action.payload);
    },

    // Копирование карты (создаём новый объект с новым id)
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

    // Экспорт данных карты как JSON-файла
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
  },
});

// Экспорт всех actions
export const {
  addUtmLink,
  removeUtmLink,
  updateIssueFormField,
  addIssueFormField,
  removeIssueFormField,
  initializeCards,
  initializeCurrentCard,
  setCurrentCardFromTemplate, // <-- добавляем в экспорт
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
