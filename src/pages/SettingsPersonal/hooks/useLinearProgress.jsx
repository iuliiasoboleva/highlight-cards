import { useCallback, useRef, useState } from 'react';

const useLinearProgress = () => {
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const startProgress = useCallback(() => {
    setProgress(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((p) => (p < 95 ? p + 2 : p));
    }, 100);
  }, []);

  const finishProgress = useCallback(() => {
    clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  }, []);

  return {
    saving,
    setSaving,
    progress,
    startProgress,
    finishProgress,
  };
};

export default useLinearProgress;
