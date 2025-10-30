export const formatChartTick = (value, selectedPeriod) => {
  const d = new Date(value);

  if (selectedPeriod === 'day') {
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  }

  if (selectedPeriod === 'year' || selectedPeriod === 'allTime') {
    const months = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ];
    return months[d.getMonth()];
  }

  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};
