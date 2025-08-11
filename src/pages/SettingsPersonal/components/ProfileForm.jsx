import React, { useMemo, useRef } from 'react';

import CustomInput from '../../../customs/CustomInput';
import CustomSelect from '../../../customs/CustomSelect';
import {
  ErrorText,
  FormGroup,
  FormRow,
  Label,
  PinBlock,
  PinInput,
  PinInputWrapper,
  SavePinButton,
} from '../styles';

const ProfileForm = ({
  user,
  countries,
  languages,
  timezones,
  onFieldChange,
  newPin,
  confirmPin,
  newPinRefs,
  confirmPinRefs,
  onPinChange,
  onPinKey,
  onSavePin,
  pinSaving = false,
}) => {
  const canSavePin = useMemo(
    () => newPin?.length === 4 && confirmPin?.length === 4 && newPin === confirmPin,
    [newPin, confirmPin],
  );
  const phoneLockedRef = useRef(Boolean(user.phone));

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
          <PinInputWrapper>
            {[0, 1, 2, 3].map((i) => (
              <PinInput
                key={i}
                ref={newPinRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={newPin[i] || ''}
                onChange={(e) => onPinChange('new', i, e.target.value)}
                onKeyDown={(e) => onPinKey('new', i, e)}
              />
            ))}
          </PinInputWrapper>
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
            <PinInputWrapper>
              {[0, 1, 2, 3].map((i) => (
                <PinInput
                  key={i}
                  ref={confirmPinRefs[i]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={confirmPin[i] || ''}
                  onChange={(e) => onPinChange('confirm', i, e.target.value)}
                  onKeyDown={(e) => onPinKey('confirm', i, e)}
                />
              ))}
            </PinInputWrapper>

            <SavePinButton
              type="button"
              onClick={onSavePin}
              disabled={!canSavePin || pinSaving}
              $active={canSavePin && !pinSaving}
            >
              {pinSaving ? 'Сохранение…' : 'Сохранить PIN'}
            </SavePinButton>
          </PinBlock>

          {(newPin || confirmPin) && newPin !== confirmPin && (
            <ErrorText>PIN-коды не совпадают</ErrorText>
          )}
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
