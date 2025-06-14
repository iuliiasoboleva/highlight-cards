import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { resetPinConfirm } from '../../store/authSlice';
import { setUser } from '../../store/userSlice';

const ResetPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [pin, setPin] = useState('');
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token, navigate]);

  const handleChange = (i, value) => {
    if (!/\d?/.test(value)) return;
    const digit = value.slice(-1);
    const arr = pin.padEnd(4, ' ').split('');
    arr[i] = digit;
    const newPin = arr.join('').trim();
    setPin(newPin);
    if (digit && i < 3) pinRefs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = pin.padEnd(4, ' ').split('');
      if (arr[i]) {
        arr[i] = '';
        setPin(arr.join('').trim());
      } else if (i > 0) {
        pinRefs[i - 1].current?.focus();
        arr[i - 1] = '';
        setPin(arr.join('').trim());
      }
    }
  };

  useEffect(() => {
    const submit = async () => {
      try {
        const data = await dispatch(resetPinConfirm({ token, pin })).unwrap();
        dispatch(setUser(data));
        navigate('/');
      } catch {
        // ошибка — вернём на auth
        navigate('/auth');
      }
    };
    if (pin.length === 4) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:24,marginTop:120 }}>
      <h2>Придумайте новый PIN</h2>
      <div style={{display:'flex',gap:12}}>
        {[0,1,2,3].map((i)=>(
          <input key={i}
            ref={pinRefs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={pin[i] || ''}
            onChange={(e)=>handleChange(i,e.target.value)}
            onKeyDown={(e)=>handleKeyDown(i,e)}
            style={{width:60,height:60,textAlign:'center',fontSize:32,border:'1px solid #d1d5db',background:'#f3f4f6',borderRadius:8}}
          />
        ))}
      </div>
      <p style={{color:'#888'}}>Введите 4-значный код</p>
    </div>
  );
};

export default ResetPin; 