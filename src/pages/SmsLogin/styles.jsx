import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 120px;
`;

export const Logo = styled.img`
  width: 140px;
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  margin: 0;
`;

export const Hint = styled.p`
  color: #888;
  margin-top: -12px;
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

  &:disabled {
    color: #888;
    cursor: default;
    text-decoration: none;
  }
`;
