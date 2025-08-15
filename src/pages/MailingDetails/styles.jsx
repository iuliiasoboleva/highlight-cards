import { Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

export const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  margin: 0 0 12px;
`;

export const FieldRow = styled.p`
  margin: 6px 0;
  line-height: 1.45;

  strong {
    font-weight: 600;
  }
`;

export const MessageBlock = styled.div`
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
`;

export const MessagePre = styled.pre`
  margin: 6px 0 0;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 14px;
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const CenterSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
`;

export const SpinnerIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

export const Empty = styled.p`
  text-align: center;
`;
