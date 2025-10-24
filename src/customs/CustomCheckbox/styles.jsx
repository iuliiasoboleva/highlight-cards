import styled from 'styled-components';

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 2px;
  font-size: 14px;
  cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  flex-shrink: 0;
  background-color: #f5f5f5;
  border: 2px solid #dcdcdc;
  border-radius: 0;
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
  ${({ $error }) =>
    $error &&
    `
    border-color: #bf4756;
    box-shadow: 0 0 0 2px rgba(191, 71, 86, 0.1);
  `}
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
