import { Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

export const Modal = styled.div`
  background: #fff;
  width: min(640px, calc(100% - 32px));
  border-radius: 12px;
  padding: 16px 16px 18px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const Title = styled.h3`
  margin: 0;
  font-weight: 600;
  font-size: 18px;
`;

export const CloseBtn = styled.button`
  appearance: none;
  border: 1px solid #e6e6e6;
  background: #fafafa;
  color: #333;
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  line-height: 1;
  font-size: 18px;

  &:hover {
    background: #f0f0f0;
  }
`;

export const Field = styled.p`
  margin: 6px 0;
  line-height: 1.45;

  strong {
    font-weight: 600;
  }
`;

export const MessageWrap = styled.div`
  margin-top: 12px;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 8px;
`;

export const Message = styled.pre`
  margin: 4px 0 0;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 14px;
`;

export const spin = keyframes`to { transform: rotate(360deg); }`;

export const Center = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

export const Empty = styled.p`
  text-align: center;
  margin: 0;
`;

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StatCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  user-select: none;
`;

export const Value = styled.div`
  font-size: 22px;
  color: ${({ $highlight, $gray }) => ($highlight ? '#e67e22' : $gray ? '#888' : 'inherit')};
`;

export const Label = styled.div`
  font-size: ${({ $small }) => ($small ? '13px' : '14px')};
  margin-top: 4px;
  color: ${({ $small }) => ($small ? '#999' : '#555')};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case 'planned':
        return `background:#fff3cd;color:#856404;`;
      case 'sent':
        return `background:#e6f4ea;color:#1b5e20;`;
      case 'draft':
        return `background:#f1f3f4;color:#666;`;
      case 'error':
        return `background:#fdecea;color:#b71c1c;`;
      default:
        return `background:#f1f3f4;color:#666;`;
    }
  }}
`;
