import React from 'react';

import CustomInput from '../../../customs/CustomInput';
import { CustomButton, SecondaryButton } from '../styles';

const LoginRequest = ({
  formData,
  onChange,
  submitting,
  isPhoneValid,
  onPhoneFocus,
  onPhoneBlur,
  onSendEmail,
  codeChannelLoading,
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
      {typeof onSendEmail === 'function' && (
        <SecondaryButton
          type="button"
          onClick={onSendEmail}
          disabled={submitting || !isPhoneValid}
          $loading={emailLoading}
        >
          {emailLoading ? '' : 'Отправить код на email'}
        </SecondaryButton>
      )}
    </>
  );
};

export default LoginRequest;
