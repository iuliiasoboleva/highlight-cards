import React from 'react';

import { Box, Label, StyledTextarea, Wrapper } from './styles';

export default function CustomTextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  disabled,
  endAdornment,
  className,
  ...rest
}) {
  return (
    <Wrapper className={className}>
      {label && <Label>{label}</Label>}
      <Box>
        <StyledTextarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          $error={!!error}
          {...rest}
        />
        {endAdornment}
      </Box>
    </Wrapper>
  );
}
