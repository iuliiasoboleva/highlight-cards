import styled, { css, keyframes } from 'styled-components';

/* ─── Animations ─────────────────────────────────────────── */
const fillBar = keyframes`
  to { width: 100%; }
`;

/* ─── Layout ─────────────────────────────────────────────── */
export const AuthFormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 280px;
  }
`;

export const AuthFormStyle = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* блок для телефонного инпута */
export const PhoneInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const CheckboxLabelText = styled.span`
  display: inline;
  width: fit-content;
`;

/* ─── Buttons ────────────────────────────────────────────── */
export const CustomButton = styled.button`
  width: 100%;
  height: 44px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #000;
    opacity: 0.8;
  }

  &:disabled {
    background-color: #d3d3d3;
    color: #999;
    cursor: not-allowed;
  }

  /* состояние лоадинга (аналог .custom-button.loading) */
  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
      color: #fff;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #b71c32 0%, #000 100%);
        animation: ${fillBar} 10s linear forwards;
      }
    `}
`;

/* ─── Links / Messages ───────────────────────────────────── */
export const LinkAction = styled.p`
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s;
  color: #4caf50;

  &:hover {
    color: #45a049;
  }
`;

export const SuccessMessage = styled.p`
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
  color: #4caf50;
`;

export const ErrorMessage = styled.p`
  font-size: 13px;
  margin: -10px 0 2px 0;
  color: #bf4756;
`;

export const LoadingMessage = styled.p`
  font-size: 13px;
  margin: -10px 0 2px 0;
  color: #45a049;
`;

/* ─── Tabs ──────────────────────────────────────────────── */
export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const Tab = styled.span`
  flex: 1;
  font-size: 36px;
  line-height: 3.2rem;
  margin: 0;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: #83848d;
  border: none;
  background-color: transparent;
  font-weight: 700;
  cursor: pointer;
  position: relative;

  /* разделитель между табами */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 20px;
    background: #000;
  }

  /* active */
  ${({ $active }) =>
    $active &&
    css`
      color: #bf4756;
    `}

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ApiError = styled.p`
  color: #d00;
  text-align: center;
  margin-bottom: 16px;
`;

export const ToggleAuth = styled.p`
  cursor: pointer;
  margin-top: 20px;
  text-align: center;
`;

export const Accent = styled.span`
  color: #bf4756;
`;

export const PinTitle = styled.p`
  text-align: center;
  color: #888;
  margin-bottom: 20px;
`;

export const PinRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
`;

export const PinDigit = styled.input.attrs({
  type: 'tel',
  inputMode: 'numeric',
  maxLength: 1,
})`
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 32px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  border-radius: 8px;
`;

export const PinNote = styled.p`
  color: #888;
  text-align: center;
  margin-top: 16px;
`;

export const CenteredLine = styled.p`
  text-align: center;
  margin-top: 16px;
`;

export const SmsLink = styled.span`
  color: ${({ $disabled }) => ($disabled ? '#888' : '#0b5cff')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;
