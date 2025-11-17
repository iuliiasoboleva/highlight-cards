import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowIcon,
  CurrentValue,
  HeaderBox,
  OptionItem,
  OptionsList,
  SelectWrapper,
} from './styles';

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = '',
  className = '',
  disabled = false,
  $error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef(null);

  const toggleOpen = () => {
    if (disabled || options.length === 0) return;
    setIsOpen((p) => !p);
  };

  const handleSelect = (selectedValue) => {
    if (disabled) return;
    onChange?.(selectedValue);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const spaceBelow = viewportHeight - rect.bottom;
    const estimatedHeight = Math.min(options.length || 0, 6) * 44 + 16;
    const shouldOpenUp = spaceBelow < estimatedHeight && rect.top > spaceBelow;
    setOpenUp(shouldOpenUp);
  }, [isOpen, options.length]);

  useEffect(() => {
    if (disabled && isOpen) setIsOpen(false);
  }, [disabled, isOpen]);

  const selectedOption = options.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <SelectWrapper className={className} ref={ref} $disabled={disabled}>
      <HeaderBox
        $opened={isOpen}
        $disabled={disabled}
        $error={$error}
        onClick={toggleOpen}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <CurrentValue>{displayValue}</CurrentValue>
        <ArrowIcon $up={isOpen} $disabled={disabled} width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none" />
        </ArrowIcon>
      </HeaderBox>

      {isOpen && !disabled && options.length > 0 && (
        <OptionsList role="listbox" $placement={openUp ? 'up' : 'down'}>
          {options.map((option) => (
            <OptionItem
              key={option.value}
              $selected={option.value === value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default CustomSelect;
