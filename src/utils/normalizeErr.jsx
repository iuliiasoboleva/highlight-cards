export const normalizeErr = (e) => {
  if (!e) return 'Неизвестная ошибка';
  if (typeof e === 'string') return e;
  if (e instanceof Error) return e.message;
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.data?.message) return e.data.message;
  if (e?.message) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
};
