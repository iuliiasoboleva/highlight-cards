export const extractError = (err) => {
  if (!err) return 'Ошибка';
  if (typeof err === 'string') return err;

  const detail = err.response?.data?.detail;
  if (detail) {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail[0]?.msg || 'Ошибка';
    if (typeof detail === 'object') return detail.message || detail.msg || 'Ошибка';
    return detail;
  }

  if (typeof err.response?.data === 'string') return err.response.data;
  return err.detail || err.message || 'Ошибка';
};
