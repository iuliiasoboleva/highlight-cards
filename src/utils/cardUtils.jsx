export const CARD_MIN_LENGTH = 6;
export const CARD_LENGTH = 16;

export const normalizeDigits = (val) => (val || '').replace(/\D+/g, '');

export const validateCard = (digits) => {
  if (!digits) return 'Введите номер карты';
  if (digits.length < CARD_MIN_LENGTH) return `Введите минимум ${CARD_MIN_LENGTH} цифр`;
  if (digits.length > CARD_LENGTH) return `Номер карты должен содержать не более ${CARD_LENGTH} цифр`;
  return '';
};
