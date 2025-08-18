export const downloadPkPass = async (cardId) => {
  const { default: axios } = await import('../axiosInstance');
  const res = await axios.get(`/passes/${cardId}`, { responseType: 'blob' });
  const blob = new Blob([res.data], { type: 'application/vnd.apple.pkpass' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cardId}.pkpass`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
