import styled, { css } from 'styled-components';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e5e5e5;
  justify-content: space-between;
  padding: 12px 16px;
  height: 100%;
  background: #fff;
  font-family: 'Manrope', sans-serif;
  gap: 24px;

  &:last-child {
    border-bottom: none;
  }
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChangeValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.024rem;
  line-height: 1.25;
  margin-right: 10px;

  ${({ $type }) =>
    $type === 'positive' &&
    css`
      color: #1cc568;
    `}
  ${({ $type }) =>
    $type === 'neutral' &&
    css`
      color: #f0a000;
    `}
  ${({ $type }) =>
    $type === 'negative' &&
    css`
      color: #f44336;
    `}
`;

export const ChangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChangeCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fef6e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 6px;
  line-height: 1.6666666667;
  color: #656565;
  letter-spacing: -0.024rem;
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${({ $variant }) =>
    $variant === 'repeat' &&
    css`
      background-color: purple;
    `}
  ${({ $variant }) =>
    $variant === 'new' &&
    css`
      background-color: #aa88ff;
    `}
  ${({ $variant }) =>
    $variant === 'referral' &&
    css`
      background-color: #00dd33;
    `}
`;
