import styled from 'styled-components';

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

export const RadioOption = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

export const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #bf4756;
  border-radius: 50%;
  transition: all 0.2s ease;

  ${HiddenInput}:checked ~ & {
    border-color: #bf4756;
    background-color: #bf4756;
  }

  &::after {
    content: '';
    position: absolute;
    display: none;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }

  ${HiddenInput}:checked ~ &::after {
    display: block;
  }
`;

export const Label = styled.span``;

export const LabelSub = styled.span`
  margin-left: 4px;
  color: #a6a5ae;
`;
