export const normalizeAddr = (s = '') =>
  s
    .toLowerCase()
    .replace(/[«»“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const round5 = (x) => (typeof x === 'number' ? Number(x.toFixed(5)) : null);

export const sameCoords = (a, b) =>
  !!a && !!b && round5(a.lat) === round5(b.lat) && round5(a.lon) === round5(b.lon);
