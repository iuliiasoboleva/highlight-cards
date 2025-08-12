import React from 'react';

import CustomInput from '../../../customs/CustomInput';
import { CustomButton } from '../styles';

const LoginRequest = ({
  formData,
  onChange,
  submitting,
  isPhoneValid,
  onPhoneFocus,
  onPhoneBlur,
}) => {
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
      <CustomButton type="submit" $loading={submitting} disabled={submitting || !isPhoneValid}>
        {submitting ? '' : 'Получить код'}
      </CustomButton>
    </>
  );
};

export default LoginRequest;
