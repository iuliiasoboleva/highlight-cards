export const CARD_LENGTH = 16;

export const normalizeDigits = (val) => (val || '').replace(/\D+/g, '');

export const validateCard = (digits) => {
  if (!digits) return 'Введите номер карты';
  if (digits.length < CARD_LENGTH) return `Введите ${CARD_LENGTH} цифр`;
  if (digits.length > CARD_LENGTH) return `Номер карты должен содержать ${CARD_LENGTH} цифр`;
  return '';
};
