import React, { useState } from 'react';
import './styles.css';

const SettingsPersonal = () => {
  const [form, setForm] = useState({
    firstName: 'qq3',
    lastName: 'qq3',
    company: '3',
    email: 'test4@gmail.com',
    phone: '+7 2322222222',
    contact: '',
    dateFormat: 'DD/MM/YYYY',
    country: 'Argentina',
    language: 'Russian',
    timezone: '(UTC+03:00) Moscow',
    password: '',
    confirmPassword: ''
  });

  const [deleteFeedback, setDeleteFeedback] = useState({
    reason1: false,
    reason2: false,
    reason3: false,
    other: ''
  });

  const [confirmDelete, setConfirmDelete] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (key) => {
    setDeleteFeedback(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-wrapper">
      <h2>Персональные настройки</h2>

      <div className="profile-section">
        <div className="profile-card">
          <div className="avatar-placeholder">+</div>
          <div className="profile-name">{form.firstName} {form.lastName}</div>
          <div className="profile-email">{form.email}</div>
        </div>

        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Имя</label>
              <input value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Название компании</label>
              <input value={form.company} onChange={e => handleChange('company', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Фамилия</label>
              <input value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Контактная информация</label>
              <input value={form.contact} onChange={e => handleChange('contact', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Телефон</label>
              <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Формат даты</label>
              <select value={form.dateFormat} onChange={e => handleChange('dateFormat', e.target.value)}>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
              </select>
            </div>
            <div className="form-group">
              <label>Новый пароль</label>
              <input type="password" placeholder="Введите пароль" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Страна</label>
              <select value={form.country} onChange={e => handleChange('country', e.target.value)}>
                <option>Argentina</option>
                <option>Russia</option>
              </select>
            </div>
            <div className="form-group">
              <label>Повтор пароля</label>
              <input type="password" placeholder="Введите пароль" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Язык</label>
              <select value={form.language} onChange={e => handleChange('language', e.target.value)}>
                <option>Russian</option>
                <option>English</option>
              </select>
            </div>
            <div className="form-group">
              <label>Таймзона</label>
              <select value={form.timezone} onChange={e => handleChange('timezone', e.target.value)}>
                <option>(UTC+03:00) Moscow</option>
              </select>
            </div>
          </div>

          <button className="btn-dark">Сохранить</button>
        </div>
      </div>

      <div className="delete-section">
        <h3>Удаление пользователя</h3>
        <p>Принесите извинения за то, что вы уходите. Прежде чем вы удалите свою учетную запись...</p>

        <div className="checkbox-group">
          <label><input type="checkbox" checked={deleteFeedback.reason1} onChange={() => handleCheckboxChange('reason1')} /> Не получилось разобраться в сервисе</label>
          <label><input type="checkbox" checked={deleteFeedback.reason2} onChange={() => handleCheckboxChange('reason2')} /> Клиентам это не интересно</label>
          <label><input type="checkbox" checked={deleteFeedback.reason3} onChange={() => handleCheckboxChange('reason3')} /> Мало функций</label>
        </div>

        <textarea
          placeholder="Другая причина"
          value={deleteFeedback.other}
          onChange={e => setDeleteFeedback(prev => ({ ...prev, other: e.target.value }))}
        />

        <div className="confirmation">
          <h4>Подтверждение</h4>
          <p>Пожалуйста, введите свой пароль администратора, чтобы удалить учетную запись с сервиса</p>
          <input type="password" placeholder="Пароль" />
          <p className="note">Как только вы удалите свою учетную запись, вся ваша личная информация и данные клиента будут потеряны</p>
        </div>

        <button className="btn-dark danger">Удалить</button>
      </div>
    </div>
  );
};

export default SettingsPersonal;
