import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CustomPinInput from '../../customs/CustomPinInput';
import { changePin } from '../../store/userSlice';
import { Logo, Note, Status, Subtitle, Title, Wrapper } from './styles';

const SetPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pin, setPin] = useState('');
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (digits) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await dispatch(changePin(digits)).unwrap();
      navigate('/');
    } catch {
      setPin('');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const submit = async () => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const digitsOnly = (pin.match(/\d/g) || []).join('');
        await dispatch(changePin(digitsOnly)).unwrap();
        navigate('/');
      } catch {
        // если ошибка — не очищаем полностью: удобнее поправить
        setPin('');
        refs[0].current?.focus();
      } finally {
        setSubmitting(false);
      }
    };

    const digitsCount = (pin.match(/\d/g) || []).length;
    if (digitsCount === 4) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <Wrapper>
      <Logo src="/logoColored.png" alt="Loyal Club" />
      <Title>Придумайте код</Title>
      <Subtitle>Для быстрого входа в личный кабинет.</Subtitle>
      <Subtitle>Работает только в том браузере, где был установлен</Subtitle>

      <CustomPinInput
        value={pin}
        onChange={setPin}
        onComplete={handleComplete}
        disabled={submitting}
      />

      <Note>Используйте только личные устройства</Note>
      {submitting && <Status>Сохраняем...</Status>}
    </Wrapper>
  );
};

export default SetPin;
