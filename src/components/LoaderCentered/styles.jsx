import { Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerIcon = styled(Loader2)`
  width: 48px;
  height: 48px;
  color: #b71c32;
  animation: ${spin} 1s linear infinite;
  transform-origin: 50% 50%;
`;
