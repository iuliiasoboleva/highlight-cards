import React from 'react';

import CustomInput from '../../../customs/CustomInput';
import { ApiError, CustomButton, SecondaryButton } from '../styles';

const LoginRequest = ({
  formData,
  onChange,
  submitting,
  isPhoneValid,
  onPhoneFocus,
  onPhoneBlur,
  onSendEmail,
  codeChannelLoading,
  smsFallback,
}) => {
  const smsLoading = codeChannelLoading === 'sms';
  const emailLoading = codeChannelLoading === 'email';

  return (
    <>
      <CustomInput
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={onChange}
        onFocus={onPhoneFocus}
        onBlur={onPhoneBlur}
        required
      />
      <CustomButton
        type="submit"
        $loading={smsLoading}
        disabled={submitting || !isPhoneValid}
      >
        {smsLoading ? '' : 'Получить код'}
      </CustomButton>
      {smsFallback && (
        <>
          <ApiError>
            {smsFallback.message}
            {smsFallback.email ? ` (${smsFallback.email})` : ''}
          </ApiError>
          {typeof onSendEmail === 'function' && (
            <SecondaryButton
              type="button"
              onClick={onSendEmail}
              disabled={submitting || !isPhoneValid || !smsFallback.email}
              $loading={emailLoading}
            >
              {emailLoading ? '' : 'Отправить код на email'}
            </SecondaryButton>
          )}
        </>
      )}
    </>
  );
};

export default LoginRequest;
