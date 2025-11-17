import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { extractError } from '../../helpers/extractError';
import {
  requestMagicLink,
  requestSmsCode,
  resetPinRequest,
  setPinThunk,
  verifyPin,
} from '../../store/authSlice';
import { fetchOrganization, setUser } from '../../store/userSlice';
import LoginRequest from './components/LoginRequest';
import ModeTabs from './components/ModeTabs';
import PinStep from './components/PinStep';
import RegisterRequest from './components/RegisterRequest';
import { Accent, ApiError, AuthFormStyle, AuthFormWrapper, ToggleAuth } from './styles';

let debounceTimeout = null;

const AuthForm = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [step, setStep] = useState('request'); // сохраняем для регистрации
  const [userType, setUserType] = useState('company');
  const [touchedFields, setTouchedFields] = useState({ inn: false, email: false });

  const prevPhoneDigits = useRef('');

  const [formData, setFormData] = useState({
    email: '',
    inn: '',
    pin: '',
    phone: '',
    companyName: '',
    firstName: '',
    lastName: '',
    confirmInn: false,
    acceptTerms: false,
    referral: '',
    otherReferral: '',
    promoCode: '',
  });

  const [companyError, setCompanyError] = useState('');
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [magicToken, setMagicToken] = useState('');
  const [apiError, setApiError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [codeChannelLoading, setCodeChannelLoading] = useState(null);
  const [smsFallback, setSmsFallback] = useState(null);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const resetForm = () => {
    setFormData({
      email: '',
      inn: '',
      pin: '',
      phone: '',
      companyName: '',
      firstName: '',
      lastName: '',
      confirmInn: false,
      acceptTerms: false,
      referral: '',
      otherReferral: '',
      promoCode: '',
    });
    setTouchedFields({ inn: false, email: false });
    setCompanyError('');
    setStep('request');
  };

  const handleChange = (e) => {
    if (apiError) setApiError('');
    const { name, value, type, checked } = e.target;

    if (name === 'inn') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly, confirmInn: false }));

      clearTimeout(debounceTimeout);
      const trimmedValue = digitsOnly;

      debounceTimeout = setTimeout(async () => {
        if (trimmedValue.length === 10 || trimmedValue.length === 12) {
          try {
            setLoadingCompany(true);
            const res = await axiosInstance.get('/company', { params: { inn: trimmedValue } });
            setFormData((prev) => ({ ...prev, companyName: res.data.name }));
            setCompanyError('');
          } catch (err) {
            setFormData((prev) => ({ ...prev, companyName: '' }));
            setCompanyError('Компания не найдена');
          } finally {
            setLoadingCompany(false);
          }
        } else {
          setFormData((prev) => ({ ...prev, companyName: '' }));
          setCompanyError('');
        }
      }, 400);

      return;
    }

    if (name === 'phone') {
      let digits = value.replace(/\D/g, '').slice(0, 11);

      // корректируем, если удалён форматный символ
      if (
        digits.length === prevPhoneDigits.current.length &&
        value.length < formData.phone.length
      ) {
        // удалён нецифровой символ, убираем и последнюю цифру
        digits = digits.slice(0, -1);
      }

      if (digits) {
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] !== '7') digits = '7' + digits;
      }

      const format = (d) => {
        if (!d) return '';
        if (d.length === 1) return '+' + d;
        return `+${d[0]}(${d.slice(1, 4)}${d.length >= 4 ? ')' : ''}${d.slice(4, 7)}${d.length >= 7 ? '-' : ''}${d.slice(7, 9)}${d.length >= 9 ? '-' : ''}${d.slice(9, 11)}`;
      };

      prevPhoneDigits.current = digits;
      setFormData((prev) => ({ ...prev, phone: format(digits) }));
      return;
    }

    if (name === 'referral') {
      setFormData((prev) => ({ ...prev, referral: value, otherReferral: '' }));
      return;
    }

    if (name === 'otherReferral') {
      setFormData((prev) => ({ ...prev, otherReferral: value }));
      return;
    }

    if (name === 'promoCode') {
      setFormData((prev) => ({ ...prev, promoCode: value }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    setSmsFallback(null);
  }, [formData.phone, mode]);

  const requestLoginCode = async ({
    channel = 'sms',
    phoneOverride,
    fallbackEmail,
    navigateState = {},
  } = {}) => {
    const rawPhone = phoneOverride ?? formData.phone;
    const digits = (rawPhone || '').replace(/\D/g, '');
    if (digits.length !== 11) {
      setApiError('Введите корректный номер');
      return false;
    }
    setCodeChannelLoading(channel);
    try {
      const smsResult = await dispatch(requestSmsCode({ phone: digits, channel })).unwrap();
      setApiError('');
      setSmsFallback(null);

      if (smsResult.has_pin && smsResult.token) {
        setMagicToken(smsResult.token);
        setStep('pinLogin');
        return true;
      }

      navigate('/sms-code', {
        state: {
          phone: '+' + digits,
          channel: smsResult.channel || channel,
          email: smsResult.email || fallbackEmail || null,
          ...navigateState,
        },
      });
      return true;
    } catch (err) {
      const canShowFallback = mode === 'login' && step === 'request';
      const detail = err?.response?.data?.detail;
      if (
        canShowFallback &&
        detail &&
        typeof detail === 'object' &&
        detail.fallback === 'email'
      ) {
        const fallbackEmailValue = detail.email || fallbackEmail || formData.email || '';
        if (fallbackEmailValue) {
          setSmsFallback({
            email: fallbackEmailValue,
            message:
              detail.message ||
              'К сожалению, не удалось отправить SMS. Можно получить код на email, указанный при регистрации.',
          });
          setApiError('');
          return false;
        }
      }
      setApiError(extractError(err));
      return false;
    } finally {
      setCodeChannelLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setTouchedFields({ inn: true, email: true });
    setSubmitting(true);

    if (mode === 'login') {
      if (step === 'pinLogin') {
        try {
          const userData = await dispatch(
            verifyPin({ token: magicToken, pin: formData.pin }),
          ).unwrap();
          dispatch(setUser(userData));
          if (userData.organization_id) dispatch(fetchOrganization(userData.organization_id));
          navigate('/');
        } catch (err) {
          setApiError(extractError(err));
        } finally {
          setSubmitting(false);
          return;
        }
      }

      // быстрый вход
      const quick = localStorage.getItem('quickJwt');
      const enteredDigits = formData.phone.replace(/\D/g, '');
      if (quick) {
        try {
          const prevAuth = axiosInstance.defaults.headers['Authorization'];
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${quick}`;
          const meRes = await axiosInstance.get('/auth/users/me');
          const { email: userEmail, has_pin, phone: savedPhone } = meRes.data;
          const savedDigits = (savedPhone || '').replace(/\D/g, '');

          if (enteredDigits && enteredDigits === savedDigits && has_pin) {
            // быстрая авторизация по PIN
            const resTok = await dispatch(
              requestMagicLink({ email: userEmail, sendEmail: false }),
            ).unwrap();
            if (resTok.token) setMagicToken(resTok.token);
            setStep('pinLogin');
            axiosInstance.defaults.headers['Authorization'] = prevAuth;
            setSubmitting(false);
            return;
          }
          // если телефон не совпадает или пин не задан — игнорируем quick и идём по SMS
          axiosInstance.defaults.headers['Authorization'] = prevAuth;
        } catch (err) {
          // ошибка чтения quickJwt, продолжаем по SMS
          setApiError('');
        }
      }

      // Нет quickjwt → работаем по SMS или PIN
      await requestLoginCode({ channel: 'sms' });
      setSubmitting(false);
      return;
    }

    // mode === 'register'
    if (step === 'request') {
      const role = userType === 'company' ? 'admin' : 'employee';
      try {
        await dispatch(
          requestMagicLink({
            email: formData.email,
            inn: formData.inn,
            role,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone.replace(/\D/g, ''),
            referral: formData.referral,
            otherReferral: formData.otherReferral,
            promo_code: formData.promoCode,
            sendEmail: false,
          }),
        ).unwrap();

        await requestLoginCode({ channel: 'sms', fallbackEmail: formData.email });
      } catch (err) {
        setApiError(extractError(err));
      } finally {
        setSubmitting(false);
      }
      return;
    } else {
      if (mode === 'register') {
        try {
          const userData = await dispatch(
            setPinThunk({ token: magicToken, pin: formData.pin }),
          ).unwrap();
          dispatch(setUser(userData));
          if (userData.organization_id) dispatch(fetchOrganization(userData.organization_id));
          navigate('/');
        } catch (err) {
          setApiError(extractError(err));
        } finally {
          setSubmitting(false);
          return;
        }
      } else {
        try {
          await dispatch(verifyPin({ token: magicToken, pin: formData.pin })).unwrap();
        } catch (err) {
          setApiError(extractError(err));
        } finally {
          setSubmitting(false);
          return;
        }
      }
    }
  };

  const handleSendLinkAgain = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const ok = await requestLoginCode({
        channel: 'sms',
        fallbackEmail: formData.email,
        navigateState: { forceSetPin: true },
      });
      if (!ok) setStep('request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (submitting) return;
    setSubmitting(true);
    if (!smsFallback?.email) {
      setSubmitting(false);
      return;
    }
    try {
      await requestLoginCode({ channel: 'email', fallbackEmail: smsFallback.email });
    } finally {
      setSubmitting(false);
    }
  };

  const isEmailValid = formData.email.includes('@');
  const isInnValid =
    userType === 'employee' || formData.inn.length === 10 || formData.inn.length === 12;
  const isCompanyLoaded = userType === 'employee' || !!formData.companyName || isInnValid;
  const isNameValid = formData.firstName.trim().length > 0;
  const isSurnameValid = formData.lastName.trim().length > 0;
  const isPhoneValid = formData.phone.replace(/\D/g, '').length === 11;
  const isTermsAccepted = formData.acceptTerms === true;
  const isReferralValid =
    formData.referral &&
    (formData.referral !== 'Другое' || formData.otherReferral.trim().length > 0);

  const isFormValid =
    isEmailValid &&
    isInnValid &&
    isCompanyLoaded &&
    isNameValid &&
    isSurnameValid &&
    isPhoneValid &&
    isTermsAccepted &&
    isReferralValid;

  // авто-сабмит после полной длины PIN
  useEffect(() => {
    const readyForSubmit =
      formData.pin.length === 4 &&
      !submitting &&
      (step === 'pin' || (step === 'pinLogin' && !!magicToken));
    if (readyForSubmit) {
      handleSubmit({ preventDefault: () => {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pin, submitting, step, magicToken]);

  return (
    <>
      <ModeTabs
        mode={mode}
        onSelect={(next) => {
          if (mode !== next) {
            setMode(next);
            resetForm();
            setStep('request');
            setApiError('');
          }
        }}
      />

      <AuthFormWrapper>
        <AuthFormStyle onSubmit={handleSubmit}>
          {mode === 'login' && step === 'request' && (
            <LoginRequest
              formData={formData}
              onChange={handleChange}
              submitting={submitting}
              isPhoneValid={isPhoneValid}
              onPhoneFocus={() => setPhoneFocused(true)}
              onPhoneBlur={() => setPhoneFocused(false)}
              codeChannelLoading={codeChannelLoading}
              smsFallback={smsFallback}
              onSendEmail={handleSendEmailCode}
            />
          )}

          {mode === 'login' && step === 'sent' && (
            <p>Ссылка отправлена на {formData.email}. Проверьте почту.</p>
          )}

          {mode === 'register' && step === 'request' && (
            <RegisterRequest
              formData={formData}
              userType={userType}
              touchedFields={touchedFields}
              isEmailValid={isEmailValid}
              isInnValid={isInnValid}
              isCompanyLoaded={isCompanyLoaded}
              loadingCompany={loadingCompany}
              companyError={companyError}
              onChange={handleChange}
              onBlur={handleBlur}
              setFormData={setFormData}
              submitting={submitting}
              isFormValid={isFormValid}
            />
          )}

          {(step === 'pin' || step === 'pinLogin') && (
            <PinStep
              step={step}
              pin={formData.pin}
              submitting={submitting}
              onChangePin={(digits) => setFormData((p) => ({ ...p, pin: digits }))}
              onSendLinkAgain={handleSendLinkAgain}
            />
          )}

          {apiError && <ApiError>{apiError}</ApiError>}
        </AuthFormStyle>

        {step !== 'pin' && (
          <ToggleAuth
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              resetForm();
              setStep('request');
              setApiError('');
            }}
          >
            {mode === 'register' ? (
              <>
                Уже есть аккаунт? <Accent>Войти</Accent>
              </>
            ) : (
              <>
                Нет аккаунта? <Accent>Зарегистрируйтесь</Accent>
              </>
            )}
          </ToggleAuth>
        )}
      </AuthFormWrapper>
    </>
  );
};

export default AuthForm;
