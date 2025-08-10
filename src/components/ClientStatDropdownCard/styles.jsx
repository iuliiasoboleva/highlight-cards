import styled, { css } from 'styled-components';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  font-family: 'Manrope', sans-serif;
  border-right: 1px solid #e5e5e5;
  justify-content: space-between;
  position: relative;
  height: 100%;
  background: #fff;
  gap: 24px;
  margin-top: 4px;

  &:last-child {
    border-right: none;
    border-bottom: none;
  }

  @media (max-width: 999px) {
    border-bottom: 1px solid #e5e5e5;
    border-right: none;
    margin-top: 0;
  }
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 6px;
  line-height: 1.6666666667;
  color: #656565;
  letter-spacing: -0.024rem;

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    `}
`;

export const ChangeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

export const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $type }) =>
    $type === 'positive' &&
    css`
      background-color: #e9fdf3;
      color: #1cc568;
    `}
  ${({ $type }) =>
    $type === 'neutral' &&
    css`
      background-color: #fff7ea;
      color: #f0a000;
    `}
  ${({ $type }) =>
    $type === 'negative' &&
    css`
      background-color: #fdecea;
      color: #f44336;
    `}
`;

export const Value = styled.div`
  font-size: 40px;
  color: #000;
  line-height: 1.3;
  font-weight: 300;
`;

export const Popover = styled.div`
  position: absolute;
  top: 40px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
`;

export const Options = styled.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  overflow: hidden;
  min-width: 160px;
  z-index: 2;
`;

export const Option = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  line-height: 1.6666666667;
  color: #656565;
  letter-spacing: -0.024rem;
  background: #fff;
  transition: background 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #f0f0f0;
  }
`;
