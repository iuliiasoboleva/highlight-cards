import React from 'react';

import { IconButton, IconImg, Input, InputWrapper, RequiredMark, Suffix } from './styles';

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
  suffix,
  ...props
}) => {
  const hasIcon = Boolean(iconSrc);
  const hasSuffix = typeof suffix === 'string' && suffix.length > 0;

  return (
    <InputWrapper>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        $hasIcon={hasIcon}
        $hasSuffix={hasSuffix}
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
      {hasSuffix && <Suffix>{suffix}</Suffix>}
    </InputWrapper>
  );
};

export default CustomInput;
