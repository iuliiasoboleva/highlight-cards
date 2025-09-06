export const getPointsBounds = (planKey) => {
  if (planKey === 'free') return { min: 1, max: 1 };
  if (planKey === 'network') return { min: 3, max: 100 };
  return { min: 1, max: 2 };
};

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
