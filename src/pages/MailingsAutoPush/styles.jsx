import styled from 'styled-components';

export const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
  margin-bottom: 16px;
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

export const MainButton = styled.button`
  background: #1f1e1f;
  color: #fff;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 24px;
  min-height: 40px;
  width: -webkit-fill-available;

  &:hover {
    background: #111;
  }

  &:disabled {
    background: gray;
    cursor: auto;
  }
`;
