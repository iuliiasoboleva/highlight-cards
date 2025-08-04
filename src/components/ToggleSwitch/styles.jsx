import styled from 'styled-components';

export const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? '#bf4756' : '#ccc')};
  transition: background-color 0.4s;
  border-radius: 34px;

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: transform 0.4s;
    border-radius: 50%;
    transform: ${({ checked }) => (checked ? 'translateX(20px)' : 'none')};
  }
`;
