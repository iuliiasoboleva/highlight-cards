import styled, { keyframes } from 'styled-components';

export const slideIn = keyframes`
  from { transform: translateY(-8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

export const ToastViewport = styled.div`
  position: fixed;
  top: 90px;
  right: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10001;
  pointer-events: none;

  @media (max-width: 768px) {
    right: 16px;
    left: 16px;
    top: 72px;
  }
`;

export const colors = {
  success: '#00c853',
  error: '#e53935',
  info: '#1e88e5',
};

export const ToastItem = styled.div`
  pointer-events: auto;
  min-width: 260px;
  max-width: 420px;
  background: ${({ type }) => colors[type] || colors.success};
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  animation: ${slideIn} 120ms ease-out;
  font-size: 14px;
  line-height: 1.35;
  cursor: pointer;
  user-select: none;
`;
