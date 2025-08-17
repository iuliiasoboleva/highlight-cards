import styled from 'styled-components';

export const NotificationsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

export const Line = styled.hr`
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #d5d5dd;
  margin-bottom: 24px;
`;

export const Subtitle = styled.p`
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
`;

export const Button = styled.button`
  padding: 14px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &.disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
