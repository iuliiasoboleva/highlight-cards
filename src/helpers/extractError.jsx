export const extractError = (err) => {
  if (!err) return 'Ошибка';
  if (typeof err === 'string') return err;
  if (err.response?.data?.detail) return err.response.data.detail;
  if (typeof err.response?.data === 'string') return err.response.data;
  if (Array.isArray(err.response?.data?.detail)) return err.response.data.detail[0]?.msg;
  return err.detail || err.message || 'Ошибка';
};
