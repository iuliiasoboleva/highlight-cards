export function countClientsBySegments(segments, clients) {
  const counts = segments.map(() => 0);

  // Для каждого клиента ищем сегмент, в который он попадает по freq/recency
  clients.forEach((c) => {
    const idx = segments.findIndex(
      (s) =>
        Number(c.freq) >= Number(s.freqFrom) &&
        Number(c.freq) <= Number(s.freqTo) &&
        Number(c.recency) >= Number(s.recencyFrom) &&
        Number(c.recency) <= Number(s.recencyTo),
    );
    if (idx !== -1) counts[idx] += 1;
  });

  return counts;
}
