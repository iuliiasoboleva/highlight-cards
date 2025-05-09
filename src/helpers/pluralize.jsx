export const pluralize = (count, variants) => {
  count = Math.abs(count) % 100;
  const lastDigit = count % 10;

  if (count > 10 && count < 20) return variants[2];
  if (lastDigit > 1 && lastDigit < 5) return variants[1];
  if (lastDigit === 1) return variants[0];

  return variants[2];
};

export const pluralVerb = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};
