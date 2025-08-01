import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changePin } from '../../store/userSlice';

const SetPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (i, value) => {
    if (!/\d?/.test(value)) return;
    const digit = value.slice(-1);
    const arr = pin.padEnd(4, ' ').split('');
    arr[i] = digit;
    const newPin = arr.join('').trim();
    setPin(newPin);
    if (digit && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = pin.padEnd(4, ' ').split('');
      if (arr[i]) {
        arr[i] = '';
        setPin(arr.join('').trim());
      } else if (i > 0) {
        refs[i - 1].current?.focus();
        arr[i - 1] = '';
        setPin(arr.join('').trim());
      }
    }
  };

  useEffect(() => {
    const submit = async () => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await dispatch(changePin(pin)).unwrap();
        navigate('/');
      } catch {
        // если ошибка, просто сбросим и дадим повторить
        setPin('');
        refs[0].current?.focus();
      } finally {
        setSubmitting(false);
      }
    };
    if (pin.length === 4) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        marginTop: 120,
      }}
    >
      <img src="/logoColored.png" alt="Loyal Club" style={{ width: 140, marginBottom: 24 }} />
      <h2 style={{ marginBottom: 8 }}>Придумайте код</h2>
      <p style={{ color: '#888', marginTop: 0, marginBottom: 24, textAlign: 'center' }}>
        Для быстрого входа в личный кабинет.{' '}
        <p>Работает только в том браузере, где был установлен</p>
      </p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={pin[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={submitting}
            style={{
              width: 60,
              height: 60,
              textAlign: 'center',
              fontSize: 32,
              border: '1px solid #d1d5db',
              background: '#f3f4f6',
              borderRadius: 8,
            }}
          />
        ))}
      </div>
      <p style={{ color: '#888', textAlign: 'center' }}>Используйте только личные устройства</p>
      {submitting && <p style={{ color: '#888' }}>Сохраняем...</p>}
    </div>
  );
};

export default SetPin;
