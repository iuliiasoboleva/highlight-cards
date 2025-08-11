export const mockRFM = [
  {
    title: 'Требуют внимания',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 61,
    recencyTo: 90,
  },
  {
    title: 'Лояльные - постоянные',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 31,
    recencyTo: 60,
  },
  {
    title: 'Чемпионы',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 0,
    recencyTo: 30,
  },
  {
    title: 'В зоне риска',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 61,
    recencyTo: 90,
  },
  {
    title: 'Средние (на грани)',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 31,
    recencyTo: 60,
  },
  {
    title: 'Растущие',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 0,
    recencyTo: 30,
  },
];

export const mockClients = Array.from({ length: 650 }, (_, i) => {
  const freq = Math.floor(Math.random() * 12) + 1;
  const recency = Math.floor(Math.random() * 91);
  return { id: i + 1, freq, recency };
});
