import styled, { css } from 'styled-components';

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: 14px;
`;

export const HeaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #bf4756;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  ${({ $opened }) =>
    $opened &&
    css`
      border-color: #bf4756;
    `}
`;

export const CurrentValue = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ArrowIcon = styled.svg`
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.25);
  transition: transform 0.3s;

  ${({ $up }) =>
    $up &&
    css`
      transform: rotate(180deg);
      color: rgba(0, 0, 0, 0.45);
    `}
`;

export const OptionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  padding: 4px 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 10000;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const OptionItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: rgba(191, 71, 86, 0.1);
  }

  ${({ $selected }) =>
    $selected &&
    css`
      color: #bf4756;
      background-color: rgba(191, 71, 86, 0.1);
      font-weight: 500;
    `}
`;
