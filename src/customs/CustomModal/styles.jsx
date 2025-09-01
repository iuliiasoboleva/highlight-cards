import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(18, 18, 18, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 16px;
`;

export const Dialog = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
`;

export const CloseBtn = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  margin: -6px;
  border-radius: 6px;
  cursor: pointer;
  color: #4a4a4a;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const Content = styled.div`
  padding: 20px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
  padding: 16px 20px 20px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
`;

export const BaseButton = styled.button`
  appearance: none;
  border: 0;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.2;
  width: 100%;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: #000;
  color: #fff;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: #f5f5f5;
  color: #2c3e50;

  &:hover:not(:disabled) {
    background: #efefef;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;
