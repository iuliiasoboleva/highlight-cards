import React, { useMemo } from 'react';

import { Box, Counter, Label, StyledTextarea, Wrapper } from './styles';

export default function CustomTextArea({
  label,
  value = '',
  onChange,
  placeholder,
  error,
  rows = 4,
  disabled,
  endAdornment,
  className,

  showCounter = false,
  maxLength,
  warnAt,
  ...rest
}) {
  const length = typeof value === 'string' ? value.length : 0;

  const remaining = useMemo(() => {
    if (typeof maxLength !== 'number') return null;
    return Math.max(0, maxLength - length);
  }, [length, maxLength]);

  const warnThreshold = useMemo(() => {
    if (typeof maxLength !== 'number') return null;
    // По умолчанию предупреждаем, когда осталось <= 10% (но не больше 20)
    const byPercent = Math.ceil(maxLength * 0.1);
    return typeof warnAt === 'number' ? warnAt : Math.min(20, byPercent);
  }, [maxLength, warnAt]);

  const showCnt = showCounter && typeof maxLength === 'number';

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
          maxLength={typeof maxLength === 'number' ? maxLength : undefined}
          {...rest}
        />
        {endAdornment}
      </Box>

      {showCnt && (
        <Counter
          role="status"
          aria-live="polite"
          title={remaining === 0 ? 'Достигнут лимит символов' : undefined}
          $warn={remaining !== null && remaining > 0 && remaining <= warnThreshold}
          $danger={remaining === 0}
        >
          {remaining !== null && remaining <= warnThreshold && remaining > 0 && (
            <p>Осталось {remaining}</p>
          )}
          <span>
            {length} / {maxLength}
          </span>
        </Counter>
      )}
    </Wrapper>
  );
}
