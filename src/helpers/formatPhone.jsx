export const formatPhone = (value = '') => {
  // оставляем только цифры
  let digits = value.replace(/\D/g, '');

  if (!digits) return '';

  // гарантируем, что номер начинается с 7
  if (digits[0] !== '7') {
    digits = '7' + digits;
  }

  // максимум 11 цифр
  digits = digits.slice(0, 11);

  // маска
  let formatted = '+7';
  const rest = digits.slice(1);

  if (rest.length > 0) formatted += `(${rest.slice(0, 3)}`;
  if (rest.length >= 3) formatted += `)`;
  if (rest.length > 3) formatted += rest.slice(3, 6);
  if (rest.length >= 6) formatted += `-${rest.slice(6, 8)}`;
  if (rest.length >= 8) formatted += `-${rest.slice(8, 10)}`;

  return formatted;
};
