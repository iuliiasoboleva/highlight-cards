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

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {type === 'register' && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Фамилия"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Название компании"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <div className="phone-input">
            <img src="/flag-russia.png" alt="Flag" />
            <input
              type="tel"
              name="phone"
              placeholder="+7"
              value={formData.phone}
              onChange={handleChange}
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
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
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
            required
          />
          <select
            name="tariff"
            value={formData.tariff}
            onChange={handleChange}
            required
          >
            <option value="">Выберите тариф</option>
            <option value="basic">Базовый</option>
            <option value="premium">Премиум</option>
          </select>
          <label className="checkbox">
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

      <button type="submit">
        {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default AuthForm;
