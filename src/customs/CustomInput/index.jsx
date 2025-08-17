import React from 'react';

import { Input, InputWrapper, RequiredMark } from './styles';

const CustomInput = ({ value, onChange, placeholder = '', type = 'text', required, ...props }) => {
  return (
    <InputWrapper>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        {...props}
      />
      {required && <RequiredMark>*</RequiredMark>}
    </InputWrapper>
  );
};

export default CustomInput;
