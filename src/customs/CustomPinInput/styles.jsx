import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const Digit = styled.input.attrs({
  type: 'tel',
  inputMode: 'numeric',
  maxLength: 1,
})`
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 32px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  border-radius: 8px;

  &:disabled {
    opacity: 0.6;
  }
`;
