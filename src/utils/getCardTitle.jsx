import { cardTypes } from '../pages/EditType/cardTypes';

const TYPE_NAME_BY_ID = cardTypes.reduce((acc, t) => {
  acc[t.id] = t.name;
  return acc;
}, {});

export const getCardTitle = (card) => {
  const raw = (card?.name ?? '').trim();
  if (raw) return raw;

  const st = (card?.status ?? '').trim();
  if (st && TYPE_NAME_BY_ID[st]) return TYPE_NAME_BY_ID[st];

  return 'Карта';
};
