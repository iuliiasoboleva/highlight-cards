import React from 'react';

import { Input } from './styles';

const CustomInput = ({ value, onChange, placeholder = '', type = 'text', ...props }) => {
  return (
    <Input value={value} onChange={onChange} placeholder={placeholder} type={type} {...props} />
  );
};

export default CustomInput;
