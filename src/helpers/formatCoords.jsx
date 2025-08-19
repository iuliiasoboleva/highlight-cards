export const formatCoords = (c) =>
  c && typeof c.lat === 'number' && typeof c.lon === 'number'
    ? `${c.lat?.toFixed(6)}, ${c.lon?.toFixed(6)}`
    : '';

export const normalizeCoords = (coords) => {
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng ?? coords?.lon);
  return {
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    lon: Number.isFinite(lng) ? lng : null,
  };
};
