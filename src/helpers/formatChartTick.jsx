export const formatChartTick = (value, selectedPeriod) => {
  const d = new Date(value);

  if (selectedPeriod === 'day') {
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  }

  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};
