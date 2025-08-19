import React from 'react';

import { IconButton, IconImg, Input, InputWrapper, RequiredMark } from './styles';

const CustomInput = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required,
  iconSrc,
  iconAlt = 'icon',
  iconTitle,
  onIconClick,
  iconAriaLabel,
  disabled,
  ...props
}) => {
  const hasIcon = Boolean(iconSrc);

  return (
    <InputWrapper>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        $hasIcon={hasIcon}
        disabled={disabled}
        {...props}
      />

      {hasIcon && (
        <IconButton
          type="button"
          onClick={onIconClick}
          aria-label={iconAriaLabel || iconAlt}
          title={iconTitle}
          disabled={disabled}
        >
          <IconImg src={iconSrc} alt={iconAlt} />
        </IconButton>
      )}

      {required && <RequiredMark>*</RequiredMark>}
    </InputWrapper>
  );
};

export default CustomInput;
