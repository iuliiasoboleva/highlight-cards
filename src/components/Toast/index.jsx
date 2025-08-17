import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { ToastItem, ToastViewport } from './styles';

const ToastCtx = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider/>');
  return ctx;
};

export const ToastProvider = ({ children, duration = 3000, maxToasts = 3 }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (payload) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => {
        const next = [...prev, { id, ...payload }].slice(-maxToasts);
        return next;
      });
      const tm = setTimeout(() => remove(id), payload.duration ?? duration);
      timers.current.set(id, tm);
    },
    [duration, maxToasts, remove],
  );

  const api = useMemo(
    () => ({
      show: (msg, type = 'success', opts = {}) => push({ msg, type, ...opts }),
      success: (msg, opts = {}) => push({ msg, type: 'success', ...opts }),
      error: (msg, opts = {}) => push({ msg, type: 'error', ...opts }),
      info: (msg, opts = {}) => push({ msg, type: 'info', ...opts }),
    }),
    [push],
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <ToastViewport>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            type={t.type}
            role="status"
            aria-live="polite"
            onClick={() => remove(t.id)}
            title="Нажмите, чтобы закрыть"
          >
            {t.msg}
          </ToastItem>
        ))}
      </ToastViewport>
    </ToastCtx.Provider>
  );
};
