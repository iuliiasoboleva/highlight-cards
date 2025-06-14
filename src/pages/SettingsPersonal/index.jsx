import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

import CustomSelect from '../../components/CustomSelect';
import { logout, removeAvatar, updateField, updateUserSettings, updateProfile, changePin, uploadAvatar, deleteAccount } from '../../store/userSlice';

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
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const newPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef(null);

  if (user.isLoading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 200px)'}}>
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleCheckboxChange = (key) => {
    const updatedFeedback = { ...deleteFeedback, [key]: !deleteFeedback[key] };
    setDeleteFeedback(updatedFeedback);
    // dispatch(updateDeleteFeedback(updatedFeedback));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    try{
      await dispatch(uploadAvatar(file)).unwrap();
      showToast('Фото обновлено', true);
    }catch(err){
      showToast('Не удалось загрузить фото', false);
    }
  };

  const showToast = (msg, ok=true) => {
    setToast({msg, ok});
    setTimeout(()=>setToast(null),3000);
  };

  const startProgress = ()=>{
    setProgress(0);
    progressTimer.current = setInterval(()=>{
      setProgress((p)=> (p<95 ? p+2 : p));
    },100);
  };
  const finishProgress = ()=>{
    clearInterval(progressTimer.current);
    setProgress(100);
    setTimeout(()=> setProgress(0),500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    startProgress();
    try{
      const promises=[];
      promises.push(dispatch(updateProfile({ name:user.firstName, surname:user.lastName, phone:user.phone, extra_contacts:user.contact })).unwrap());
      promises.push(dispatch(updateUserSettings({ date_format:user.dateFormat, country:user.country, language:user.language, timezone:user.timezone, extra_contacts:user.contact, avatar_url:user.avatar })).unwrap());
      if(newPin || confirmPin){
        if(newPin.length!==4 || newPin!==confirmPin){
          showToast('PIN-коды не совпадают', false);
          return;
        }
        promises.push(dispatch(changePin(newPin)).unwrap());
        setNewPin('');
        setConfirmPin('');
      }
      await Promise.all(promises);
      showToast('Настройки сохранены', true);
    }catch(err){
      showToast(typeof err==='string'?err:'Ошибка сохранения', false);
    }
    setSaving(false);
    finishProgress();
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (confirmDelete !== 'ПОДТВЕРЖДАЮ') {
      showToast('Введите подтверждение правильно', false);
      return;
    }
    try {
      await dispatch(deleteAccount(deleteFeedback)).unwrap();
      showToast('Аккаунт удалён', true);
      setTimeout(()=> dispatch(logout()), 1200);
    } catch(err){
      showToast(typeof err==='string'?err:'Ошибка удаления', false);
    }
  };

  const handlePinChange = (type, i, value) => {
    if (!/\d?/.test(value)) return;
    const digit = value.slice(-1);
    const arr = (type === 'new' ? newPin : confirmPin).padEnd(4, ' ').split('');
    arr[i] = digit;
    const pin = arr.join('').trim();
    if (type === 'new') setNewPin(pin);
    else setConfirmPin(pin);
    if (digit && i < 3) {
      (type === 'new' ? newPinRefs : confirmPinRefs)[i + 1].current?.focus();
    }
  };

  const handlePinKey = (type, i, e) => {
    if (e.key !== 'Backspace') return;

    e.preventDefault();
    const isNew = type === 'new';
    const value = isNew ? newPin : confirmPin;
    const refs = isNew ? newPinRefs : confirmPinRefs;

    const arr = value.padEnd(4, ' ').split('');

    if (arr[i]) {
      arr[i] = '';
      if (i > 0) refs[i - 1].current?.focus();
    } else if (i > 0) {
      refs[i - 1].current?.focus();
      arr[i - 1] = '';
    }

    const pin = arr.join('').trim();
    isNew ? setNewPin(pin) : setConfirmPin(pin);
  };

  // Опции для селектов
  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'День/Месяц/Год (31/12/2023)' },
    { value: 'MM/DD/YYYY', label: 'Месяц/День/Год (12/31/2023)' },
  ];

  const countries = [
    { value: 'Russia', label: 'Россия' },
  ];

  const languages = [
    { value: 'Russian', label: 'Русский' },
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                  <label>Новый PIN</label>
                  <div style={{display:'flex',gap:12}}>
                    {[0,1,2,3].map((i)=>(
                      <input key={i}
                        ref={newPinRefs[i]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={newPin[i] || ''}
                        onChange={(e)=>handlePinChange('new',i,e.target.value)}
                        onKeyDown={(e)=>handlePinKey('new',i,e)}
                        style={{width:60,height:60,textAlign:'center',fontSize:32,border:'1px solid #d1d5db',background:'#f3f4f6',borderRadius:8}}
                      />
                    ))}
                  </div>
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
                  <label>Подтверждение PIN</label>
                  <div style={{display:'flex',gap:12}}>
                    {[0,1,2,3].map((i)=>(
                      <input key={i}
                        ref={confirmPinRefs[i]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={confirmPin[i] || ''}
                        onChange={(e)=>handlePinChange('confirm',i,e.target.value)}
                        onKeyDown={(e)=>handlePinKey('confirm',i,e)}
                        style={{width:60,height:60,textAlign:'center',fontSize:32,border:'1px solid #d1d5db',background:'#f3f4f6',borderRadius:8}}
                      />
                    ))}
                  </div>
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

              <button type="submit" className="custom-main-button" disabled={saving} style={{position:'relative',overflow:'hidden'}}>
                <span style={{opacity: saving ? 0 : 1}}>Сохранить изменения</span>
                {saving && (
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#b71c32 0%,#000 100%)',transition:'width 0.1s linear'}} />
                )}
              </button>
            </div>

            <div className="delete-section">
              <h3>Удаление аккаунта</h3>
              <p>
                Перед удалением аккаунта сообщите, пожалуйста, причину. Это поможет нам улучшить
                сервис.
              </p>

              <div className="checkbox-group">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason1}
                    onChange={() => handleCheckboxChange('reason1')}
                  />
                  Сложно разобраться в интерфейсе
                </label>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason2}
                    onChange={() => handleCheckboxChange('reason2')}
                  />
                  Нет нужного мне функционала
                </label>
                <label className="custom-checkbox">
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
      {toast && (
        <div style={{position:'fixed',top:90,right:40,background:toast.ok?'#00c853':'#e53935',color:'#fff',padding:'12px 24px',borderRadius:8,boxShadow:'0 4px 12px rgba(0,0,0,.15)',zIndex:999}}>{toast.msg}</div>
      )}
    </div>
  );
};

export default SettingsPersonal;
