import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowIcon,
  CurrentValue,
  HeaderBox,
  OptionItem,
  OptionsList,
  SelectWrapper,
} from './styles';

const CustomSelect = ({ value, onChange, options, placeholder = '', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <SelectWrapper className={className} ref={selectRef}>
      <HeaderBox $opened={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        <CurrentValue>{displayValue}</CurrentValue>
        <ArrowIcon
          $up={isOpen}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none" />
        </ArrowIcon>
      </HeaderBox>

      {isOpen && (
        <OptionsList>
          {options.map((option, index) => (
            <OptionItem
              key={index}
              $selected={option.value === value}
              onClick={() => handleSelect(option.value)}
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
