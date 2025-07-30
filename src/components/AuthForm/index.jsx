import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import {
  requestMagicLink,
  requestSmsCode,
  resetPinRequest,
  setPinThunk,
  verifyPin,
} from '../../store/authSlice';
import { fetchOrganization, setUser } from '../../store/userSlice';
import InnSuggestInput from '../InnSuggestInput';

import './styles.css';

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
    acceptTerms: false,
    referral: '',
    otherReferral: '',
    promoCode: '',
  });

  const [companyError, setCompanyError] = useState('');
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [magicToken, setMagicToken] = useState('');
  const [apiError, setApiError] = useState('');

  // refs для ячеек PIN
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [submitting, setSubmitting] = useState(false);
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
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));

      clearTimeout(debounceTimeout);
      const trimmedValue = digitsOnly;

      debounceTimeout = setTimeout(async () => {
        if (trimmedValue.length === 10 || trimmedValue.length === 12) {
          try {
            setLoadingCompany(true);
            const res = await axiosInstance.get('/company', { params: { inn: trimmedValue } });
            console.log('Company data', res.data);
            setFormData((prev) => ({ ...prev, companyName: res.data.name }));
            setCompanyError('');
          } catch (err) {
            console.error('Ошибка получения компании', err?.response?.status);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
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

      // Нет quickjwt → работаем по SMS
      try {
        const digits = formData.phone.replace(/\D/g, '');
        if (digits.length !== 11) {
          setApiError('Введите корректный номер');
          setSubmitting(false);
          return;
        }
        await dispatch(requestSmsCode({ phone: digits })).unwrap();
        setApiError('');
        navigate('/sms-code', { state: { phone: '+' + digits } });
      } catch (err) {
        setApiError(extractError(err));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // mode === 'register'
    if (step === 'request') {
      const role = userType === 'company' ? 'admin' : 'employee';
      try {
        const res = await dispatch(
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

        // после успешного создания пользователя отправляем SMS код
        const digits = formData.phone.replace(/\D/g, '');
        await dispatch(requestSmsCode({ phone: digits })).unwrap();
        setApiError('');
        navigate('/sms-code', { state: { phone: '+' + digits } });
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

  const handlePinChange = (index, value) => {
    if (!/\d?/.test(value)) return;
    const digits = value.slice(-1);
    const newPinArr = formData.pin.padEnd(4, ' ').split('');
    newPinArr[index] = digits;
    const newPin = newPinArr.join('').trim();
    setFormData((prev) => ({ ...prev, pin: newPin }));

    if (digits && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentVal = formData.pin[index] || '';
      const pinArr = formData.pin.padEnd(4, ' ').split('');
      if (currentVal) {
        // стираем текущую цифру
        pinArr[index] = '';
        setFormData((prev) => ({ ...prev, pin: pinArr.join('').trim() }));
      } else if (index > 0) {
        // переходим на предыдущую ячейку и стираем
        pinRefs[index - 1].current?.focus();
        pinArr[index - 1] = '';
        setFormData((prev) => ({ ...prev, pin: pinArr.join('').trim() }));
      }
    }
  };

  const goToPinLogin = () => {
    setStep('pinLogin');
    setApiError('');
  };

  const handleSendLinkAgain = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length !== 11) {
        setStep('request');
        setSubmitting(false);
        return;
      }
      await dispatch(requestSmsCode({ phone: digits })).unwrap();
      navigate('/sms-code', { state: { phone: '+' + digits, forceSetPin: true } });
    } catch (err) {
      setApiError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isEmailValid = formData.email.includes('@');
  const isInnValid =
    userType === 'employee' || formData.inn.length === 10 || formData.inn.length === 12;
  const isCompanyLoaded = userType === 'employee' || !!formData.companyName;
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

  const extractError = (err) => {
    if (!err) return 'Ошибка';
    if (typeof err === 'string') return err;
    if (err.response?.data?.detail) return err.response.data.detail;
    if (typeof err.response?.data === 'string') return err.response.data;
    if (Array.isArray(err.response?.data?.detail)) return err.response.data.detail[0]?.msg;
    return err.detail || err.message || 'Ошибка';
  };

  // авто-сабмит после полной длины PIN
  useEffect(() => {
    if (formData.pin.length === 4 && !submitting && (step === 'pinLogin' || step === 'pin')) {
      // создаём фейковый event для совместимости
      handleSubmit({ preventDefault: () => {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pin]);

  return (
    <>
      {/* {mode === 'register' ? (
        <div className="tabs">
          <span
            className={userType === 'company' ? 'active' : ''}
            onClick={() => {
              setUserType('company');
              resetForm();
            }}
          >
            Компания
          </span>
          <span
            className={userType === 'employee' ? 'active' : ''}
            onClick={() => {
              setUserType('employee');
              resetForm();
            }}
          >
            Сотрудник
          </span>
        </div>
      ) : null} */}
      <div className="tabs">
        <span
          className={mode === 'register' ? 'active' : ''}
          onClick={() => {
            if (mode !== 'register') {
              setMode('register');
              resetForm();
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          Регистрация
        </span>
        <span
          className={mode === 'login' ? 'active' : ''}
          onClick={() => {
            if (mode !== 'login') {
              setMode('login');
              resetForm();
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          Вход
        </span>
      </div>
      <div className="auth-form-wrapper">
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'login' && step === 'request' && (
            <>
              <input
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className="custom-input"
                required
              />
              {phoneFocused && formData.phone && (
                <p className="loading-message" style={{ marginTop: '-10px' }}>
                  Проверьте номер — SMS-код придёт на него
                </p>
              )}
              <button
                type="submit"
                className={`custom-button ${submitting ? 'loading' : ''}`}
                disabled={submitting || !isPhoneValid}
              >
                {submitting ? '' : 'Получить код'}
              </button>
            </>
          )}

          {mode === 'login' && step === 'sent' && (
            <p>Ссылка отправлена на {formData.email}. Проверьте почту.</p>
          )}

          {mode === 'register' && step === 'request' && (
            <>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`custom-input ${touchedFields.email && !isEmailValid ? 'input-error' : ''}`}
                required
              />
              {touchedFields.email && !isEmailValid && (
                <p className="error-message">Введите корректный email</p>
              )}
              <input
                name="firstName"
                placeholder="Имя"
                value={formData.firstName}
                onChange={handleChange}
                className="custom-input"
                required
              />
              <input
                name="lastName"
                placeholder="Фамилия"
                value={formData.lastName}
                onChange={handleChange}
                className="custom-input"
                required
              />
              <input
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className="custom-input"
                required
              />
              {phoneFocused && formData.phone && (
                <p className="loading-message" style={{ marginTop: '-10px' }}>
                  Проверьте номер — SMS-код для регистрации придёт на него
                </p>
              )}
              {userType === 'company' && (
                <>
                  <InnSuggestInput
                    value={formData.inn}
                    onChange={(text) => {
                      setFormData((prev) => ({ ...prev, inn: text }));
                    }}
                    onBlur={() => handleBlur('inn')}
                    onSelect={(item) => {
                      const inn = item.data.inn || '';
                      const companyName = item.value || '';
                      setFormData((prev) => ({ ...prev, inn, companyName }));
                      setCompanyError('');
                    }}
                    placeholder="ИНН или название компании"
                    inputClass={`custom-input ${touchedFields.inn && !isInnValid ? 'input-error' : ''}`}
                  />

                  {touchedFields.inn && !isInnValid && (
                    <p className="error-message">ИНН должен содержать 10 или 12 цифр</p>
                  )}

                  {touchedFields.inn && isInnValid && companyError && (
                    <p className="error-message">{companyError}</p>
                  )}

                  {loadingCompany && (
                    <p className="loading-message">Загружаем данные компании...</p>
                  )}

                  {formData.companyName && (
                    <input
                      name="companyName"
                      className="custom-input"
                      value={formData.companyName}
                      readOnly
                      disabled
                    />
                  )}
                </>
              )}

              <select
                name="referral"
                value={formData.referral}
                onChange={handleChange}
                className="custom-select"
                required
              >
                <option value="" disabled>
                  Откуда вы о нас узнали?
                </option>
                <option>Социальные сети</option>
                <option>Telegram</option>
                <option>Рекомендация</option>
                <option>От представителя Loyal Club</option>
                <option>Поиск в Google или Яндекс</option>
                <option>На конференции</option>
                <option>Другое</option>
              </select>

              {formData.referral === 'Другое' && (
                <input
                  name="otherReferral"
                  placeholder="Укажите источник"
                  value={formData.otherReferral}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
              )}

              <input
                name="promoCode"
                placeholder="Промокод (необязательно)"
                value={formData.promoCode}
                onChange={handleChange}
                className="custom-input"
              />

              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span className="checkbox-label-text">
                  Я принимаю{' '}
                  <a href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
                    условия соглашения
                  </a>{' '}
                  и{' '}
                  <a href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
                    политику обработки персональных данных
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className={`custom-button ${submitting ? 'loading' : ''}`}
                disabled={submitting || !isFormValid}
              >
                {submitting ? '' : 'Зарегистрироваться'}
              </button>
            </>
          )}

          {(step === 'pin' || step === 'pinLogin') && (
            <>
              <p
                className="pin-title"
                style={{ textAlign: 'center', color: '#888', marginBottom: '20px' }}
              >
                {step === 'pinLogin' ? 'Введите PIN-код' : 'Для быстрого входа придумайте PIN'}
              </p>
              <div
                className="pin-input-wrapper"
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    ref={pinRefs[i]}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={formData.pin[i] || ''}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    disabled={submitting}
                    style={{
                      width: '60px',
                      height: '60px',
                      textAlign: 'center',
                      fontSize: '32px',
                      border: '1px solid #d1d5db',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={submitting || formData.pin.length !== 4}
                className="custom-button"
              >
                {step === 'pinLogin' ? 'Войти' : 'Сохранить PIN'}
              </button>
              {step === 'pin' && (
                <p
                  style={{
                    color: '#888',
                    textAlign: 'center',
                    marginTop: '16px',
                  }}
                >
                  Запомните PIN — он позволит входить без SMS-кода
                </p>
              )}
              {submitting && step === 'pin' && <p style={{ color: '#888' }}>Проверяем...</p>}
              {step === 'pinLogin' && (
                <p style={{ marginTop: '16px', textAlign: 'center' }}>
                  <span
                    onClick={submitting ? undefined : handleSendLinkAgain}
                    style={{
                      color: submitting ? '#888' : '#0b5cff',
                      cursor: submitting ? 'default' : 'pointer',
                      pointerEvents: submitting ? 'none' : 'auto',
                    }}
                  >
                    {submitting ? 'Проверяем...' : 'Не помню PIN — войти по SMS'}
                  </span>
                </p>
              )}
            </>
          )}
          {apiError && (
            <p style={{ color: '#d00', textAlign: 'center', marginBottom: '16px' }}>{apiError}</p>
          )}
        </form>
        {step !== 'pin' && (
          <p
            className="toggle-auth"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              resetForm();
              setStep('request');
              setApiError('');
            }}
            style={{ cursor: 'pointer', marginTop: '20px', textAlign: 'center' }}
          >
            {mode === 'register' ? (
              <>
                Уже есть аккаунт? <span style={{ color: '#bf4756' }}>Войти</span>
              </>
            ) : (
              <>
                Нет аккаунта? <span style={{ color: '#bf4756' }}>Зарегистрируйтесь</span>
              </>
            )}
          </p>
        )}
      </div>
    </>
  );
};

export default AuthForm;
