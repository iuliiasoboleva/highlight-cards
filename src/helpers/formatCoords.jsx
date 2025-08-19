export const formatCoords = (c) =>
  c && typeof c.lat === 'number' && typeof c.lon === 'number'
    ? `${c.lat.toFixed(6)}, ${c.lon.toFixed(6)}`
    : '';
