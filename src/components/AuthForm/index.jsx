import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import { requestMagicLink, verifyPin } from '../../store/authSlice';

import './styles.css';

let debounceTimeout = null;

const AuthForm = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [step, setStep] = useState('request'); // сохраняем для регистрации
  const [userType, setUserType] = useState('company');
  const [touchedFields, setTouchedFields] = useState({ inn: false, email: false });

  const [formData, setFormData] = useState({
    email: '',
    inn: '',
    pin: '',
    phone: '',
    companyName: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  });

  const [companyError, setCompanyError] = useState('');
  const [loadingCompany, setLoadingCompany] = useState(false);

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
    });
    setTouchedFields({ inn: false, email: false });
    setCompanyError('');
    setStep('request');
  };

  const handleChange = (e) => {
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

      if (digits) {
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] !== '7') digits = '7' + digits;
      }

      const format = (d) => {
        if (!d) return '';
        if (d.length === 1) return '+' + d;
        return `+${d[0]}(${d.slice(1, 4)}${d.length >=4?')':''}${d.slice(4,7)}${d.length >=7?'-':''}${d.slice(7,9)}${d.length>=9?'-':''}${d.slice(9,11)}`;
      };

      setFormData((prev) => ({ ...prev, phone: format(digits) }));
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

    if (mode === 'login') {
      await dispatch(requestMagicLink({ email: formData.email }));
      setStep('sent');
      return;
    }

    // mode === 'register'
    if (step === 'request') {
      const role = userType === 'company' ? 'admin' : 'employee';
      await dispatch(
        requestMagicLink({
          email: formData.email,
          inn: formData.inn,
          role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone.replace(/\D/g, ''),
        }),
      );
      setStep('pin');
    } else {
      await dispatch(verifyPin({ email: formData.email, pin: formData.pin }));
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

  const isFormValid =
    isEmailValid &&
    isInnValid &&
    isCompanyLoaded &&
    isNameValid &&
    isSurnameValid &&
    isPhoneValid &&
    isTermsAccepted;

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
        <span className="active">
          {mode === 'register' ? 'Регистрация' : 'Вход'}
        </span>
      </div>
      <div className="auth-form-wrapper">
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'login' && step === 'request' && (
            <>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="custom-input"
                required
              />
              <button
                type="submit"
                className="custom-button"
                disabled={status === 'loading' || !isEmailValid}
              >
                Войти
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
                className="custom-input"
                required
              />
              {userType === 'company' && (
                <>
                  <input
                    name="inn"
                    placeholder="ИНН"
                    value={formData.inn}
                    onChange={handleChange}
                    onBlur={() => handleBlur('inn')}
                    inputMode="numeric"
                    className={`custom-input ${touchedFields.inn && !isInnValid ? 'input-error' : ''}`}
                    pattern="\d*"
                    maxLength={12}
                    required
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

              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                Я принимаю условия соглашения
              </label>

              <button
                type="submit"
                className="custom-button"
                disabled={status === 'loading' || !isFormValid}
              >
                Зарегистрироваться
              </button>
            </>
          )}

          {mode === 'register' && step === 'pin' && (
            <>
              <input
                name="pin"
                placeholder="PIN-код"
                value={formData.pin}
                onChange={handleChange}
                className="custom-input"
                required
              />
              <button type="submit" disabled={status === 'loading'} className="custom-button">
                Войти
              </button>
            </>
          )}
        </form>
        <p
          className="toggle-auth"
          onClick={() => {
            setMode(mode === 'register' ? 'login' : 'register');
            resetForm();
            setStep('request');
          }}
          style={{ cursor: 'pointer', marginTop: '20px', textAlign: 'center' }}
        >
          {mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрируйтесь'}
        </p>
      </div>
    </>
  );
};

export default AuthForm;
