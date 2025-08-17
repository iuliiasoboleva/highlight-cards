import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #111;
`;

export const Box = styled.div`
  position: relative;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #d5d5dd;
  border-radius: 6px;
  font-size: 16px;
  resize: vertical;
  outline: none;

  &:disabled {
    background: #f5f5f5;
  }

  ${({ $error }) =>
    $error &&
    css`
      border-color: #ef4444;
    `}
`;
