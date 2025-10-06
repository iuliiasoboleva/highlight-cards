import styled, { css } from 'styled-components';

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: -webkit-fill-available;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.3s;
  font-size: 16px;
  outline: none;

  &:hover {
    border-color: #bf4756;
  }

  ${({ $hasIcon }) =>
    $hasIcon &&
    css`
      padding-right: 40px;
    `}

  ${({ $hasSuffix }) =>
    $hasSuffix &&
    css`
      padding-right: 44px;
    `}

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

  ${({ required }) =>
    required &&
    css`
      padding-right: 20px;
    `}

  ${({ $error }) =>
    $error &&
    css`
      border-color: #bf4756;
      box-shadow: 0 0 0 2px rgba(191, 71, 86, 0.1);
    `}
`;

export const RequiredMark = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #c14857;
  font-size: 16px;
  pointer-events: none;
`;

export const IconButton = styled.button`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: #fff;
  border-radius: 6px;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    background: #f0f0f3;
  }

  &:active {
    background: #e8e8ee;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const IconImg = styled.img`
  display: block;
  width: 18px;
  height: 18px;
  object-fit: contain;
  pointer-events: none;
`;

export const Suffix = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a8a8a;
  font-size: 14px;
  pointer-events: none;
`;
