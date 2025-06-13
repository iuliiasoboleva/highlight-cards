import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { requestMagicLink, verifyPin, setPinThunk } from '../../store/authSlice';

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
  const [magicToken, setMagicToken] = useState('');
  const [apiError, setApiError] = useState('');

  // refs для ячеек PIN
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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
      if (step === 'pinLogin') {
        try {
          await dispatch(verifyPin({ email: formData.email, pin: formData.pin })).unwrap();
          navigate('/');
        } catch (err) {
          setApiError(extractError(err));
        }
        return;
      }

      try {
        const resCheck = await axiosInstance.get('/auth/check-email', {
          params: { email: formData.email },
        });

        if (resCheck.data.has_pin) {
          goToPinLogin();
          return;
        }

        // нет пина — шлём magic link
        await dispatch(requestMagicLink({ email: formData.email })).unwrap();
        setStep('sent');
      } catch (err) {
        setApiError(extractError(err));
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
            sendEmail: false,
          }),
        ).unwrap();
        if (res.token) setMagicToken(res.token);
        setStep('pin');
        setApiError('');
      } catch (err) {
        setApiError(extractError(err));
      }
    } else {
      if (mode === 'register') {
        try {
          await dispatch(setPinThunk({ token: magicToken, pin: formData.pin })).unwrap();
          navigate('/');
        } catch (err) {
          setApiError(extractError(err));
        }
      } else {
        try {
          await dispatch(verifyPin({ email: formData.email, pin: formData.pin })).unwrap();
        } catch (err) {
          setApiError(extractError(err));
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

  const goToPinLogin = () => {
    setStep('pinLogin');
    setApiError('');
  };

  const handleSendLinkAgain = async () => {
    try {
      await dispatch(requestMagicLink({ email: formData.email })).unwrap();
      setStep('sent');
    } catch (err) {
      setApiError(extractError(err));
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

  const extractError = (err) => {
    if (!err) return 'Ошибка';
    if (typeof err === 'string') return err;
    if (err.response?.data?.detail) return err.response.data.detail;
    if (typeof err.response?.data === 'string') return err.response.data;
    if (Array.isArray(err.response?.data?.detail)) return err.response.data.detail[0]?.msg;
    return err.detail || err.message || 'Ошибка';
  };

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
                className={`custom-button ${status==='loading' ? 'loading':''}`}
                disabled={status === 'loading' || !isEmailValid}
              >
                {status==='loading' ? '' : 'Войти'}
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
                className={`custom-button ${status==='loading' ? 'loading':''}`}
                disabled={status === 'loading' || !isFormValid}
              >
                {status==='loading' ? '' : 'Зарегистрироваться'}
              </button>
            </>
          )}

          {(step === 'pin' || step === 'pinLogin') && (
            <>
              <p className="pin-title" style={{textAlign:'center', color:'#888', marginBottom:'20px'}}>
                {step==='pinLogin' ? 'Введите код для быстрого входа' : 'Для быстрого входа придумайте PIN'}
              </p>
              <div className="pin-input-wrapper" style={{display:'flex', gap:'12px', justifyContent:'center', marginBottom:'20px'}}>
                {[0,1,2,3].map((i)=>(
                  <input key={i}
                    ref={pinRefs[i]}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={formData.pin[i] || ''}
                    onChange={(e)=>handlePinChange(i,e.target.value)}
                    style={{width:'60px',height:'60px',textAlign:'center',fontSize:'32px',border:'1px solid #d1d5db',background:'#f3f4f6',borderRadius:'8px'}}
                  />))}
              </div>
              <button type="submit" disabled={status === 'loading' || formData.pin.length!==4} className="custom-button">
                {step==='pinLogin' ? 'Войти' : 'Сохранить PIN'}
              </button>
              {step==='pinLogin' && (
                <p style={{marginTop:'16px', textAlign:'center'}}>
                  <span onClick={handleSendLinkAgain} style={{color:'#0b5cff', cursor:'pointer'}}>Не помню PIN — отправить ссылку</span>
                </p>
              )}
            </>
          )}
          {apiError && (
            <p style={{color:'#d00', textAlign:'center', marginBottom:'16px'}}>{apiError}</p>
          )}
        </form>
        {step!=='pin' && (
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
          {mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрируйтесь'}
        </p> )}
      </div>
    </>
  );
};

export default AuthForm;
