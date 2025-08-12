import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CustomPinInput from '../../customs/CustomPinInput';
import { resetPinConfirm } from '../../store/authSlice';
import { setUser } from '../../store/userSlice';
import { Note, Title, Wrapper } from './styles';

const ResetPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token, navigate]);

  const handleComplete = async (digits) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await dispatch(resetPinConfirm({ token, pin: digits })).unwrap();
      dispatch(setUser(data));
      navigate('/');
    } catch {
      navigate('/auth');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Title>Придумайте новый PIN</Title>

      <CustomPinInput
        value={pin}
        onChange={setPin}
        onComplete={handleComplete}
        disabled={submitting}
        autoFocus
      />

      <Note>Введите 4-значный код</Note>
    </Wrapper>
  );
};

export default ResetPin;
