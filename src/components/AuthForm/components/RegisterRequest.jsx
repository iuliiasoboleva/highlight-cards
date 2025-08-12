import React from 'react';

import CustomCheckbox from '../../../customs/CustomCheckbox';
import CustomInput from '../../../customs/CustomInput';
import CustomSelect from '../../../customs/CustomSelect';
import InnSuggestInput from '../../InnSuggestInput';
import { CustomButton, ErrorMessage, LoadingMessage } from '../styles';

const REFERRAL_OPTIONS = [
  { value: 'Социальные сети', label: 'Социальные сети' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Рекомендация', label: 'Рекомендация' },
  { value: 'От представителя Loyal Club', label: 'От представителя Loyal Club' },
  { value: 'Поиск в Google или Яндекс', label: 'Поиск в Google или Яндекс' },
  { value: 'На конференции', label: 'На конференции' },
  { value: 'Другое', label: 'Другое' },
];

const RegisterRequest = ({
  formData,
  userType,
  touchedFields,
  isEmailValid,
  isInnValid,
  loadingCompany,
  companyError,
  onChange,
  onBlur,
  setFormData,
  submitting,
  isFormValid,
}) => {
  const handleReferralChange = (val) => {
    onChange({
      target: {
        name: 'referral',
        value: val,
        type: 'custom-select',
      },
    });
  };

  return (
    <>
      <CustomInput
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        onBlur={() => onBlur('email')}
        aria-invalid={touchedFields.email && !isEmailValid}
      />
      {touchedFields.email && !isEmailValid && (
        <ErrorMessage>Введите корректный email</ErrorMessage>
      )}

      <CustomInput
        name="firstName"
        placeholder="Имя"
        value={formData.firstName}
        onChange={onChange}
        required
      />
      <CustomInput
        name="lastName"
        placeholder="Фамилия"
        value={formData.lastName}
        onChange={onChange}
        required
      />
      <CustomInput
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={onChange}
        required
      />

      {userType === 'company' && (
        <>
          <InnSuggestInput
            value={formData.inn}
            onChange={(text) => setFormData((prev) => ({ ...prev, inn: text }))}
            onBlur={() => onBlur('inn')}
            onSelect={(item) => {
              const inn = item.data.inn || '';
              const companyName = item.value || '';
              setFormData((prev) => ({ ...prev, inn, companyName }));
            }}
            placeholder="ИНН или название компании"
            $error={touchedFields.inn && !isInnValid}
          />

          {touchedFields.inn && !isInnValid && (
            <ErrorMessage>ИНН должен содержать 10 или 12 цифр</ErrorMessage>
          )}

          {touchedFields.inn && isInnValid && companyError && (
            <ErrorMessage>{companyError}</ErrorMessage>
          )}

          {loadingCompany && <LoadingMessage>Загружаем данные компании...</LoadingMessage>}

          {formData.companyName && (
            <CustomInput name="companyName" value={formData.companyName} readOnly disabled />
          )}
        </>
      )}

      <CustomSelect
        name="referral"
        value={formData.referral}
        options={REFERRAL_OPTIONS}
        placeholder="Откуда вы о нас узнали?"
        onChange={handleReferralChange}
      />

      {formData.referral === 'Другое' && (
        <CustomInput
          name="otherReferral"
          placeholder="Укажите источник"
          value={formData.otherReferral}
          onChange={onChange}
          required
        />
      )}

      <CustomInput
        name="promoCode"
        placeholder="Промокод (необязательно)"
        value={formData.promoCode}
        onChange={onChange}
      />

      <CustomCheckbox
        name="acceptTerms"
        checked={formData.acceptTerms}
        onChange={onChange}
        label={
          <>
            Я принимаю{' '}
            <a href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
              условия соглашения
            </a>{' '}
            и{' '}
            <a href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
              политику обработки персональных данных
            </a>
          </>
        }
      />

      <CustomButton type="submit" $loading={submitting} disabled={submitting || !isFormValid}>
        {submitting ? '' : 'Зарегистрироваться'}
      </CustomButton>
    </>
  );
};

export default RegisterRequest;
