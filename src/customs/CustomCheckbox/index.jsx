import React from 'react';

import { CheckboxWrapper, HiddenCheckbox, LabelText, StyledCheckbox } from './styles';

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  name,
  required,
  linkLabel,
  linkHref,
  $error,
  disabled,
}) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        $error={$error}
        disabled={disabled}
      />
      <StyledCheckbox checked={checked} />
      {label && (
        <LabelText>
          {label}{' '}
          {linkLabel && linkHref && (
            <a href={linkHref} target="_blank" rel="noopener noreferrer">
              {linkLabel}
            </a>
          )}
        </LabelText>
      )}
    </CheckboxWrapper>
  );
};

export default CustomCheckbox;
