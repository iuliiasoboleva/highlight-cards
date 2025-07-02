import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { verifySmsCode } from '../../store/authSlice';
import { setUser } from '../../store/userSlice';

const SmsLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, forceSetPin } = location.state || {};

  const [code, setCode] = useState('');
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!phone) navigate('/auth');
  }, [phone, navigate]);

  const handleChange = (i, value) => {
    if (!/\d?/.test(value)) return;
    const digit = value.slice(-1);
    const arr = code.padEnd(4, ' ').split('');
    arr[i] = digit;
    const newCode = arr.join('').trim();
    setCode(newCode);
    if (digit && i < 3) inputRefs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = code.padEnd(4, ' ').split('');
      if (arr[i]) {
        arr[i] = '';
        setCode(arr.join('').trim());
      } else if (i > 0) {
        inputRefs[i - 1].current?.focus();
        arr[i - 1] = '';
        setCode(arr.join('').trim());
      }
    }
  };

  useEffect(() => {
    const submit = async () => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const data = await dispatch(verifySmsCode({ phone: phone.replace(/\D/g, ''), code })).unwrap();
        dispatch(setUser(data));
        if (forceSetPin || !data.has_pin) {
          navigate('/set-pin');
        } else {
          navigate('/');
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : err?.message || 'Ошибка');
        setCode('');
        inputRefs[0].current?.focus();
      } finally {
        setSubmitting(false);
      }
    };
    if (code.length === 4) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

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
      <h2>Введите код из SMS</h2>
      <p style={{ color: '#888', marginTop: -12 }}>Отправили на {phone}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={inputRefs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={code[i] || ''}
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
      {submitting && <p style={{ color: '#888' }}>Проверяем...</p>}
      {error && <p style={{ color: '#d00' }}>{error}</p>}
    </div>
  );
};

export default SmsLogin; 