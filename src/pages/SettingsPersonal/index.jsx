import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomSelect from '../../components/CustomSelect';
import { logout, removeAvatar, setAvatar, updateField } from '../../store/userSlice';

import './styles.css';

const SettingsPersonal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [deleteFeedback, setDeleteFeedback] = useState({
    reason1: false,
    reason2: false,
    reason3: false,
    other: '',
  });

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleCheckboxChange = (key) => {
    const updatedFeedback = { ...deleteFeedback, [key]: !deleteFeedback[key] };
    setDeleteFeedback(updatedFeedback);
    // dispatch(updateDeleteFeedback(updatedFeedback));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setAvatar(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Настройки успешно сохранены (мок)');
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (confirmDelete === 'ПОДТВЕРЖДАЮ') {
      alert('Аккаунт будет удален (мок)');
      dispatch(logout());
    } else {
      alert('Введите подтверждение правильно');
    }
  };

  // Опции для селектов
  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'День/Месяц/Год (31/12/2023)' },
    { value: 'MM/DD/YYYY', label: 'Месяц/День/Год (12/31/2023)' },
  ];

  const countries = [
    { value: 'Russia', label: 'Россия' },
    { value: 'Argentina', label: 'Аргентина' },
  ];

  const languages = [
    { value: 'Russian', label: 'Русский' },
    { value: 'English', label: 'Английский' },
  ];

  const timezones = [{ value: '(UTC+03:00) Moscow', label: '(UTC+03:00) Москва' }];

  return (
    <div className="settings-wrapper">
      <h2>Персональные настройки</h2>

      <form onSubmit={handleSubmit}>
        <div className="profile-section">
          <div className="profile-card">
            <div className="avatar-container">
              {user.avatar ? (
                <>
                  <div className="avatar-image-wrapper">
                    <img
                      src={user.avatar}
                      alt="Аватар"
                      className="avatar-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        dispatch(removeAvatar());
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-avatar-btn"
                    onClick={() => dispatch(removeAvatar())}
                  >
                    Удалить фото
                  </button>
                </>
              ) : (
                <label className="avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <div className="avatar-placeholder">
                    <span>+</span>
                  </div>
                  <span className="avatar-upload-text">Добавить фото</span>
                </label>
              )}
            </div>
            <div className="profile-name">
              {user.firstName} {user.lastName}
            </div>
            <div className="profile-email">{user.email}</div>
          </div>

          <div className="profile-right-block">
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Имя*</label>
                  <input
                    value={user.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Название компании</label>
                  <input
                    value={user.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Фамилия*</label>
                  <input
                    value={user.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Дополнительная контактная информация</label>
                  <input
                    value={user.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    placeholder="Telegram, Skype и т.д."
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Формат даты</label>
                  <CustomSelect
                    options={dateFormats}
                    value={user.dateFormat}
                    onChange={(value) => handleChange('dateFormat', value)}
                  />
                </div>
                <div className="form-group">
                  <label>Новый пароль</label>
                  <input
                    type="password"
                    value={user.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Введите новый пароль"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Страна</label>
                  <CustomSelect
                    options={countries}
                    value={user.country}
                    onChange={(value) => handleChange('country', value)}
                  />
                </div>
                <div className="form-group">
                  <label>Подтверждение пароля</label>
                  <input
                    type="password"
                    value={user.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Повторите новый пароль"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Язык интерфейса</label>
                  <CustomSelect
                    options={languages}
                    value={user.language}
                    onChange={(value) => handleChange('language', value)}
                  />
                </div>
                <div className="form-group">
                  <label>Часовой пояс</label>
                  <CustomSelect
                    options={timezones}
                    value={user.timezone}
                    onChange={(value) => handleChange('timezone', value)}
                  />
                </div>
              </div>

              <button type="submit" className="settings-btn-dark">
                Сохранить изменения
              </button>
            </div>

            <div className="delete-section">
              <h3>Удаление аккаунта</h3>
              <p>
                Перед удалением аккаунта сообщите, пожалуйста, причину. Это поможет нам улучшить
                сервис.
              </p>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason1}
                    onChange={() => handleCheckboxChange('reason1')}
                  />
                  Сложно разобраться в интерфейсе
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason2}
                    onChange={() => handleCheckboxChange('reason2')}
                  />
                  Нет нужного мне функционала
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason3}
                    onChange={() => handleCheckboxChange('reason3')}
                  />
                  Не использую сервис
                </label>
              </div>

              <textarea
                placeholder="Другая причина (укажите подробнее)"
                value={deleteFeedback.other}
                onChange={(e) => {
                  const updated = { ...deleteFeedback, other: e.target.value };
                  setDeleteFeedback(updated);
                  // dispatch(updateDeleteFeedback(updated));
                }}
              />

              <div className="confirmation">
                <h4>Подтверждение удаления</h4>
                <p>
                  Для подтверждения удаления аккаунта введите фразу <strong>"ПОДТВЕРЖДАЮ"</strong>
                </p>
                <input
                  type="text"
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder="Введите ПОДТВЕРЖДАЮ"
                />
                <p className="note">
                  Внимание! После удаления аккаунта все ваши данные будут безвозвратно утеряны.
                </p>
              </div>

              <button
                type="button"
                className="settings-btn-dark danger"
                onClick={handleDeleteAccount}
                disabled={confirmDelete !== 'ПОДТВЕРЖДАЮ'}
              >
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPersonal;
