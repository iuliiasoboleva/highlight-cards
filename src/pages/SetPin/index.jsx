import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changePin } from '../../store/userSlice';

const SetPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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
      try {
        await dispatch(changePin(pin)).unwrap();
        navigate('/');
      } catch {
        // если ошибка, просто сбросим и дадим повторить
        setPin('');
        refs[0].current?.focus();
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
      <img
        src="https://optim.tildacdn.com/tild6639-6664-4537-b134-353639383763/-/resize/86x/-/format/webp/svg.png.webp"
        alt="Loyal Club"
        style={{ width: 120, marginBottom: 24 }}
      />
      <h2>Придумайте PIN</h2>
      <div style={{ display: 'flex', gap: 12 }}>
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
      <p style={{ color: '#888' }}>Введите 4-значный PIN</p>
    </div>
  );
};

export default SetPin; 