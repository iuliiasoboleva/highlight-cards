import React, { forwardRef } from 'react';

import { IconButton, IconImg, Input, InputWrapper, RequiredMark, Suffix } from './styles';

const CustomInput = forwardRef(
  (
    {
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
      $error,
      ...props
    },
    ref,
  ) => {
  const hasIcon = Boolean(iconSrc);
  const hasSuffix = typeof suffix === 'string' && suffix.length > 0;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        $hasIcon={hasIcon}
        $hasSuffix={hasSuffix}
        disabled={disabled}
        $error={$error}
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
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
