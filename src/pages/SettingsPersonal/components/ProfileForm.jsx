import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import CustomInput from '../../../customs/CustomInput';
import CustomPinInput from '../../../customs/CustomPinInput';
import CustomSelect from '../../../customs/CustomSelect';
import { changePin } from '../../../store/userSlice';
import { ErrorText, FormGroup, FormRow, Label, PinBlock, SavePinButton } from '../styles';

const sanitize = (s = '', length = 4) => (s.match(/\d/g) || []).join('').slice(0, length);

const ProfileForm = ({ user, countries, languages, timezones, onFieldChange, showToast }) => {
  const dispatch = useDispatch();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSaving, setPinSaving] = useState(false);

  const phoneLockedRef = useRef(Boolean(user.phone));

  const onNewChange = (digits) => setNewPin(sanitize(digits, 4));
  const onConfirmChange = (digits) => setConfirmPin(sanitize(digits, 4));

  const mismatch = !!(newPin || confirmPin) && newPin !== confirmPin;
  const canSavePin = newPin.length === 4 && confirmPin.length === 4 && !mismatch;

  const handleSavePin = async () => {
    if (!canSavePin) {
      showToast?.('PIN-коды не совпадают', false);
      return;
    }
    setPinSaving(true);
    try {
      await dispatch(changePin(newPin)).unwrap();
      setNewPin('');
      setConfirmPin('');
      showToast?.('Изменения сохранены', true);
    } catch {
      showToast?.('Не удалось сохранить PIN', false);
    } finally {
      setPinSaving(false);
    }
  };

  return (
    <>
      <FormRow>
        <FormGroup $area="firstName">
          <Label>Имя*</Label>
          <CustomInput
            value={user.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup $area="email">
          <Label>Email*</Label>
          <CustomInput
            type="email"
            value={user.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup $area="lastName">
          <Label>Фамилия*</Label>
          <CustomInput
            value={user.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup $area="phone">
          <Label>Телефон</Label>
          <CustomInput
            type="tel"
            value={user.phone || ''}
            disabled={phoneLockedRef.current}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            placeholder="Введите номер телефона"
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup $area="company">
          <Label>Название компании</Label>
          <CustomInput value={user.company} readOnly />
        </FormGroup>

        <FormGroup $area="telegram">
          <Label>Ваш ник в Telegram</Label>
          <CustomInput
            value={user.contact || ''}
            placeholder="@username"
            onChange={(e) => onFieldChange('contact', e.target.value)}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup $area="country">
          <Label>Страна</Label>
          <CustomSelect
            options={countries}
            value={user.country}
            onChange={(v) => onFieldChange('country', v)}
          />
        </FormGroup>
        <FormGroup $area="pinNew">
          <Label>Новый PIN</Label>
          <PinBlock>
            <CustomPinInput
              value={newPin}
              onChange={onNewChange}
              disabled={pinSaving}
              autoFocus={false}
            />
          </PinBlock>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup $area="city">
          <Label>Город</Label>
          <CustomInput
            value={user.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup $area="pinConfirm">
          <Label>Подтверждение PIN</Label>
          <PinBlock>
            <CustomPinInput
              value={confirmPin}
              onChange={onConfirmChange}
              disabled={pinSaving}
              autoFocus={false}
            />

            <SavePinButton
              type="button"
              onClick={handleSavePin}
              disabled={!canSavePin || pinSaving}
              $active={canSavePin && !pinSaving}
            >
              {pinSaving ? 'Сохранение…' : 'Сохранить PIN'}
            </SavePinButton>
          </PinBlock>

          {mismatch && <ErrorText>PIN-коды не совпадают</ErrorText>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup $area="language">
          <Label>Язык интерфейса</Label>
          <CustomSelect
            options={languages}
            value={user.language}
            onChange={(v) => onFieldChange('language', v)}
          />
        </FormGroup>
        <FormGroup $area="timezone">
          <Label>Часовой пояс</Label>
          <CustomSelect
            options={timezones}
            value={user.timezone}
            onChange={(v) => onFieldChange('timezone', v)}
          />
        </FormGroup>
      </FormRow>
    </>
  );
};

export default ProfileForm;
