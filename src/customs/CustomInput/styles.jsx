import styled from 'styled-components';

export const Input = styled.input`
  width: -webkit-fill-available;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  outline: none;

  &:hover {
    border-color: #bf4756;
  }

  &:read-only {
    background-color: #f8f8f8;
    cursor: default;
    color: #555;
  }

  &:disabled {
    background-color: #f3f3f3;
    cursor: not-allowed;
    color: #999;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
`;
