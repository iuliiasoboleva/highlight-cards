import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import CustomPinInput from '../../customs/CustomPinInput';
import { requestSmsCode, verifySmsCode } from '../../store/authSlice';
import { setUser } from '../../store/userSlice';
import { ErrorText, Hint, Logo, ResendButton, Status, Title, Wrapper } from './styles';

const RESEND_COOLDOWN = 60; // сек.

const SmsLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, forceSetPin, channel: initialChannel = 'sms', email: initialEmail } =
    location.state || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendingSms, setResendingSms] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [deliveryChannel, setDeliveryChannel] = useState(initialChannel);
  const [emailTarget, setEmailTarget] = useState(initialEmail || null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!phone) navigate('/auth');
  }, [phone, navigate]);

  useEffect(() => {
    startCooldown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = (sec = RESEND_COOLDOWN) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(sec);
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  const requestCode = async (channel) => {
    const res = await dispatch(
      requestSmsCode({ phone: phone.replace(/\D/g, ''), channel }),
    ).unwrap();
    setDeliveryChannel(res.channel || channel);
    if (res.email) setEmailTarget(res.email);
    startCooldown();
  };

  const handleResendSms = async () => {
    if (cooldown > 0 || resendingSms) return;
    setResendingSms(true);
    setError('');
    try {
      await requestCode('sms');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Не удалось отправить код');
    } finally {
      setResendingSms(false);
    }
  };

  const handleSendEmail = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    setError('');
    try {
      await requestCode('email');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Не удалось отправить код');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleComplete = async (digits) => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await dispatch(
        verifySmsCode({ phone: phone.replace(/\D/g, ''), code: digits }),
      ).unwrap();
      dispatch(setUser(data));
      if (forceSetPin || !data.has_pin) navigate('/set-pin');
      else navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Ошибка');
      setCode(''); // очистим, чтобы пользователь ввёл заново
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Logo src="/logoColored.png" alt="Loyal Club" />
      <Title>
        {deliveryChannel === 'email' ? 'Введите код из письма' : 'Введите код из SMS или Telegram'}
      </Title>
      <Hint>
        {deliveryChannel === 'email'
          ? emailTarget
            ? `Письмо отправили на ${emailTarget}`
            : 'Письмо отправили на email, проверьте входящие и спам'
          : `Отправили на ${phone}`}
      </Hint>

      <CustomPinInput
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
        disabled={submitting}
        autoFocus
      />

      {submitting && <Status>Проверяем...</Status>}
      {error && <ErrorText>{error}</ErrorText>}

      {cooldown > 0 ? (
        <Status>Отправим SMS повторно через {fmt(cooldown)}</Status>
      ) : (
        <ResendButton type="button" onClick={handleResendSms} disabled={resendingSms}>
          {resendingSms ? 'Отправляем…' : 'Отправить SMS повторно'}
        </ResendButton>
      )}
      <ResendButton type="button" onClick={handleSendEmail} disabled={resendingEmail}>
        {resendingEmail ? 'Отправляем…' : 'Отправить код на email'}
      </ResendButton>
    </Wrapper>
  );
};

export default SmsLogin;
