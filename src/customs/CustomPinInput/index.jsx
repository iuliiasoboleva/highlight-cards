import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Digit, Row } from './styles';

const CustomPinInput = ({
  length = 4,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className,
  ariaLabel = 'PIN code',
}) => {
  const refs = useMemo(() => Array.from({ length }, () => React.createRef()), [length]);
  const isPastingRef = useRef(false);
  const lastEmitted = useRef(''); // <-- NEW

  const [cells, setCells] = useState(() => {
    const d = (value.match(/\d/g) || []).slice(0, length);
    return Array.from({ length }, (_, i) => d[i] || '');
  });

  useEffect(() => {
    if (value === lastEmitted.current) return;

    const d = (value.match(/\d/g) || []).slice(0, length);
    setCells(Array.from({ length }, (_, i) => d[i] || ''));
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) refs[0]?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (arr) => {
    const digitsOnly = arr.map((c) => (/\d/.test(c) ? c : '')).join('');
    lastEmitted.current = digitsOnly;
    onChange?.(digitsOnly);
    if (digitsOnly.length === length) onComplete?.(digitsOnly);
  };

  const handleChange = (i, v) => {
    if (isPastingRef.current) return;
    if (!/\d?/.test(v)) return;

    const digit = v.slice(-1);
    setCells((prev) => {
      const next = prev.slice();
      next[i] = digit || '';
      if (digit && i < length - 1) refs[i + 1]?.current?.focus();
      emit(next);
      return next;
    });
  };

  const handleKeyDown = (i, e) => {
    if (disabled) return;
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      setCells((prev) => {
        const next = prev.slice();
        if (next[i]) {
          next[i] = '';
          emit(next);
          if (i > 0) setTimeout(() => refs[i - 1]?.current?.focus(), 0);
          return next;
        }
        if (i > 0) {
          if (next[i - 1]) next[i - 1] = '';
          emit(next);
          setTimeout(() => refs[i - 1]?.current?.focus(), 0);
        }
        return next;
      });
      return;
    }

    if (key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      refs[i - 1]?.current?.focus();
      return;
    }
    if (key === 'ArrowRight' && i < length - 1) {
      e.preventDefault();
      refs[i + 1]?.current?.focus();
      return;
    }
    if (key === 'Home') {
      e.preventDefault();
      refs[0]?.current?.focus();
      return;
    }
    if (key === 'End') {
      e.preventDefault();
      refs[length - 1]?.current?.focus();
      return;
    }
  };

  const handlePaste = (i, e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    const digits = String(text).replace(/\D/g, '');
    if (!digits) return;

    setCells((prev) => {
      const next = prev.slice();

      // если полный код — всегда с начала
      let start = digits.length === length ? 0 : i;

      // если справа не влезает, а слева есть пустые — начнём с первой пустой
      if (start !== 0 && digits.length > length - i) {
        const firstEmpty = next.findIndex((c) => !c);
        if (firstEmpty !== -1) start = firstEmpty;
      }

      isPastingRef.current = true;

      let j = 0;
      for (; j < digits.length && start + j < length; j++) {
        next[start + j] = digits[j];
      }

      emit(next);

      const nextIndex = Math.min(start + j, length - 1);
      setTimeout(() => {
        isPastingRef.current = false;
        refs[nextIndex]?.current?.focus();
      }, 0);

      return next;
    });
  };

  return (
    <Row className={className} role="group" aria-label={ariaLabel}>
      {Array.from({ length }).map((_, i) => (
        <Digit
          key={i}
          ref={refs[i]}
          value={cells[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </Row>
  );
};

export default CustomPinInput;
