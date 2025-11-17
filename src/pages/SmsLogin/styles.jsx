import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 120px;
  padding: 0 20px;
`;

export const Logo = styled.img`
  width: 140px;
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  margin: 0;
  text-align: center;
  max-width: 320px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
`;

export const Hint = styled.p`
  color: #888;
  margin-top: -12px;
  text-align: center;
`;

export const Status = styled.p`
  color: #888;
`;

export const ErrorText = styled.p`
  color: #d00;
`;

export const ResendButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin-top: 8px;

  &:disabled {
    color: #888;
    cursor: default;
    text-decoration: none;
  }
`;
