import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    // совместимость со старыми браузерами
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    setMatches(mq.matches);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener('change', handler)
        : mq.removeListener(handler);
    };
  }, [query]);

  return matches;
}
