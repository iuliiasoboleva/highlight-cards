export const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  const parts = [
    '+7',
    digits.slice(1, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ];
  let formatted = `${parts[0]}`;
  if (parts[1]) formatted += `(${parts[1]}`;
  if (digits.length > 3) formatted += ')';
  if (parts[2]) formatted += `-${parts[2]}`;
  if (parts[3]) formatted += `-${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;
  return formatted;
};
