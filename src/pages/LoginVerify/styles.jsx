import styled, { keyframes } from 'styled-components';

export const VerifyWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
  background: #f5f5f5;
`;

export const VerifyLogo = styled.img`
  width: 120px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #b71c32;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Note = styled.p`
  color: #555;
  margin: 0;
`;
