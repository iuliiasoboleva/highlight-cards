import React, { useState } from 'react';
import './styles.css';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    tariff: '',
    acceptTerms: false,
  });

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    console.log(`Отправка ссылки на email: ${resetEmail}`);
    setMessage('Ссылка для сброса пароля отправлена на вашу почту.');
  };

  return (
    <div className="auth-form-wrapper">
      <form onSubmit={isResetMode ? handleResetSubmit : handleSubmit} className="auth-form">
        {isResetMode ? (
          <>
            <input
              type="email"
              name="resetEmail"
              placeholder="Введите ваш email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="custom-input"
              required
            />
            <button type="submit" className="custom-button">
              Отправить ссылку
            </button>
            <p className="switch-mode" onClick={() => setIsResetMode(false)}>
              Вернуться к входу
            </p>
            {message && <p className="success-message">{message}</p>}
          </>
        ) : (
          <>
            {type === 'register' && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
                <input
                  type="text"
                  name="surname"
                  placeholder="Фамилия"
                  value={formData.surname}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Название компании"
                  value={formData.company}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
                <div className="phone-input">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+7"
                    value={formData.phone}
                    onChange={handleChange}
                    className="custom-input"
                    required
                  />
                </div>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="custom-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className="custom-input"
              required
            />

            {type === 'register' && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Повтор пароля"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
                <select
                  name="tariff"
                  value={formData.tariff}
                  onChange={handleChange}
                  className="custom-select"
                  required
                >
                  <option value="">Выберите тариф</option>
                  <option value="basic">Базовый</option>
                  <option value="premium">Премиум</option>
                </select>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  Я принимаю условия соглашения
                </label>
              </>
            )}

            <button type="submit" className="custom-button">
              {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>

            {type === 'login' && (
              <p className="forgot-password" onClick={() => setIsResetMode(true)}>
                Забыли пароль?
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
