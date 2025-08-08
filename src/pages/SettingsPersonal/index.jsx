import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import LoaderCentered from '../../components/LoaderCentered';
import { logout as authLogout } from '../../store/authSlice';
import {
  changePin,
  deleteAccount,
  logout,
  removeAvatar,
  updateField,
  updateProfile,
  updateUserSettings,
  uploadAvatar,
} from '../../store/userSlice';
import {
  AvatarContainer,
  AvatarImage,
  AvatarImageWrapper,
  AvatarPlaceholder,
  AvatarUpload,
  AvatarUploadText,
  ButtonProgress,
  CheckboxGroup,
  Confirmation,
  DangerButton,
  DeleteSection,
  DeleteTextarea,
  FormGroup,
  FormRow,
  Label,
  MainButton,
  Note,
  PinInput,
  PinInputWrapper,
  ProfileCard,
  ProfileEmail,
  ProfileForm,
  ProfileName,
  ProfileRightBlock,
  ProfileSection,
  RemoveAvatarBtn,
  Toast,
  Wrapper,
} from './styles';

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
    return <LoaderCentered />;
  }

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleCheckboxChange = (key) => {
    setDeleteFeedback({ ...deleteFeedback, [key]: !deleteFeedback[key] });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await dispatch(uploadAvatar(file)).unwrap();
      showToast('Фото обновлено', true);
    } catch {
      showToast('Не удалось загрузить фото', false);
    }
  };

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const startProgress = () => {
    setProgress(0);
    progressTimer.current = setInterval(() => {
      setProgress((p) => (p < 95 ? p + 2 : p));
    }, 100);
  };

  const finishProgress = () => {
    clearInterval(progressTimer.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    startProgress();
    try {
      const promises = [];
      promises.push(
        dispatch(
          updateProfile({
            name: user.firstName,
            surname: user.lastName,
            phone: user.phone,
            extra_contacts: user.contact,
          }),
        ).unwrap(),
      );
      promises.push(
        dispatch(
          updateUserSettings({
            date_format: user.dateFormat,
            country: user.country,
            language: user.language,
            timezone: user.timezone,
            extra_contacts: user.contact,
            avatar_url: user.avatar,
          }),
        ).unwrap(),
      );
      if (newPin || confirmPin) {
        if (newPin.length !== 4 || newPin !== confirmPin) {
          showToast('PIN-коды не совпадают', false);
          return;
        }
        promises.push(dispatch(changePin(newPin)).unwrap());
        setNewPin('');
        setConfirmPin('');
      }
      await Promise.all(promises);
      showToast('Настройки сохранены', true);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Ошибка сохранения', false);
    }
    setSaving(false);
    finishProgress();
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const reasonProvided =
      deleteFeedback.reason1 ||
      deleteFeedback.reason2 ||
      deleteFeedback.reason3 ||
      deleteFeedback.other.trim();
    if (!reasonProvided) {
      showToast('Укажите причину удаления', false);
      return;
    }
    if (confirmDelete.trim().toUpperCase() !== 'ПОДТВЕРЖДАЮ') {
      showToast('Поле подтверждения обязательно', false);
      return;
    }
    try {
      await dispatch(deleteAccount(deleteFeedback)).unwrap();
      showToast('Аккаунт удалён', true);
      setTimeout(() => {
        dispatch(logout());
        dispatch(authLogout());
        window.location.href = '/auth';
      }, 1200);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Ошибка удаления', false);
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

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'День/Месяц/Год (31/12/2023)' },
    { value: 'MM/DD/YYYY', label: 'Месяц/День/Год (12/31/2023)' },
  ];
  const countries = [{ value: 'Russia', label: 'Россия' }];
  const languages = [{ value: 'Russian', label: 'Русский' }];
  const timezones = [{ value: '(UTC+03:00) Moscow', label: '(UTC+03:00) Москва' }];

  return (
    <Wrapper>
      <h2>Персональные настройки</h2>
      <form onSubmit={handleSubmit}>
        <ProfileSection>
          <ProfileCard>
            <AvatarContainer>
              {user.avatar ? (
                <>
                  <AvatarImageWrapper>
                    <AvatarImage
                      src={user.avatar}
                      alt="Аватар"
                      onError={(e) => {
                        e.target.onerror = null;
                        dispatch(removeAvatar());
                      }}
                    />
                  </AvatarImageWrapper>
                  <RemoveAvatarBtn type="button" onClick={() => dispatch(removeAvatar())}>
                    Удалить фото
                  </RemoveAvatarBtn>
                </>
              ) : (
                <AvatarUpload>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <AvatarPlaceholder>
                    <span>+</span>
                  </AvatarPlaceholder>
                  <AvatarUploadText>Добавить фото</AvatarUploadText>
                </AvatarUpload>
              )}
            </AvatarContainer>
            <ProfileName>
              {user.firstName} {user.lastName}
            </ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
          </ProfileCard>

          <ProfileRightBlock>
            <ProfileForm>
              <FormRow>
                <FormGroup>
                  <Label>Имя*</Label>
                  <CustomInput
                    value={user.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Название компании</Label>
                  <CustomInput value={user.company} readOnly />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Фамилия*</Label>
                  <CustomInput
                    value={user.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email*</Label>
                  <CustomInput type="email" value={user.email} readOnly />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Дополнительная контактная информация</Label>
                  <CustomInput
                    value={user.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Телефон</Label>
                  <CustomInput type="tel" value={user.phone} readOnly />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Страна</Label>
                  <CustomSelect
                    options={countries}
                    value={user.country}
                    onChange={(v) => handleChange('country', v)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Новый PIN</Label>
                  <PinInputWrapper>
                    {[0, 1, 2, 3].map((i) => (
                      <PinInput
                        key={i}
                        ref={newPinRefs[i]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={newPin[i] || ''}
                        onChange={(e) => handlePinChange('new', i, e.target.value)}
                        onKeyDown={(e) => handlePinKey('new', i, e)}
                      />
                    ))}
                  </PinInputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Город</Label>
                  <CustomInput
                    value={user.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Подтверждение PIN</Label>
                  <PinInputWrapper>
                    {[0, 1, 2, 3].map((i) => (
                      <PinInput
                        key={i}
                        ref={confirmPinRefs[i]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={confirmPin[i] || ''}
                        onChange={(e) => handlePinChange('confirm', i, e.target.value)}
                        onKeyDown={(e) => handlePinKey('confirm', i, e)}
                      />
                    ))}
                  </PinInputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Язык интерфейса</Label>
                  <CustomSelect
                    options={languages}
                    value={user.language}
                    onChange={(v) => handleChange('language', v)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Часовой пояс</Label>
                  <CustomSelect
                    options={timezones}
                    value={user.timezone}
                    onChange={(v) => handleChange('timezone', v)}
                  />
                </FormGroup>
              </FormRow>

              <MainButton type="submit" disabled={saving}>
                <span style={{ opacity: saving ? 0 : 1 }}>Сохранить изменения</span>
                {saving && <ButtonProgress style={{ width: `${progress}%` }} />}
              </MainButton>
            </ProfileForm>

            <DeleteSection>
              <h3>Удаление аккаунта</h3>
              <p>
                Перед удалением аккаунта сообщите, пожалуйста, причину. Это поможет нам улучшить
                сервис.
              </p>
              <CheckboxGroup>
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason1}
                    onChange={() => handleCheckboxChange('reason1')}
                  />{' '}
                  Сложно разобраться в интерфейсе
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason2}
                    onChange={() => handleCheckboxChange('reason2')}
                  />{' '}
                  Нет нужного мне функционала
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={deleteFeedback.reason3}
                    onChange={() => handleCheckboxChange('reason3')}
                  />{' '}
                  Не использую сервис
                </label>
              </CheckboxGroup>
              <DeleteTextarea
                value={deleteFeedback.other}
                placeholder="Другая причина (укажите подробнее)"
                onChange={(e) => setDeleteFeedback({ ...deleteFeedback, other: e.target.value })}
              />
              <Confirmation>
                <h4>Подтверждение удаления</h4>
                <p>
                  Для подтверждения введите <strong>ПОДТВЕРЖДАЮ</strong>
                </p>
                <CustomInput
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder="Введите ПОДТВЕРЖДАЮ"
                />
                <Note>
                  Внимание! После удаления аккаунта все ваши данные будут безвозвратно утеряны.
                </Note>
              </Confirmation>
              <DangerButton type="button" onClick={handleDeleteAccount}>
                Удалить аккаунт
              </DangerButton>
            </DeleteSection>
          </ProfileRightBlock>
        </ProfileSection>
      </form>
      {toast && <Toast ok={toast.ok}>{toast.msg}</Toast>}
    </Wrapper>
  );
};

export default SettingsPersonal;
