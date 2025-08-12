import styled from 'styled-components';

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
  appearance: none;
  width: 25px;
  height: 20px;
  background-color: #f5f5f5;
  border: 2px solid #dcdcdc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  cursor: pointer;

  &:checked {
    background-color: #bf4756;
    border-color: #bf4756;
  }

  &::before {
    content: '';
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: relative;
    top: -1px;
    left: 0;
  }
`;

export const StyledCheckbox = styled.span`
  flex-shrink: 0;
`;

export const LabelText = styled.span`
  a {
    text-decoration: underline;
    color: inherit;
    white-space: nowrap;
  }
`;
