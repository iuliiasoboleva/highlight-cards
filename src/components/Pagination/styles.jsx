import styled, { css } from 'styled-components';

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.$active ? '#bf4756' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => {
    if (props.$active) return '#bf4756';
    if (props.disabled) return '#f5f5f5';
    return '#fff';
  }};
  color: ${props => {
    if (props.$active) return '#fff';
    if (props.disabled) return '#999';
    return '#333';
  }};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    ${props => !props.$active && css`
      border-color: #bf4756;
      color: #bf4756;
      background: #fff0f2;
    `}
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const PaginationNumbers = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const PaginationInfo = styled.span`
  font-size: 14px;
  color: #666;
  margin-left: 12px;
  font-weight: 500;
`;

