import styled, { keyframes } from 'styled-components';

import CustomMainButton from '../../customs/CustomMainButton';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

export const Header = styled.header`
  display: none; /* скрываем локальный хедер; используем глобальный SubMenu */
`;

export const BackBtn = styled(CustomMainButton)``;

export const Arrow = styled.span`
  display: inline-block;
  transform: translateY(-1px);
`;

export const Logo = styled.img``;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 80px; /* больше отступ снизу, чтобы подсказки были внизу */
  gap: 12px;
`;

export const UserText = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export const spin = keyframes` to { transform: rotate(360deg); }`;

export const Loader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-direction: column;

  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #ddd;
    border-top-color: #000;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const Message = styled.p`
  margin-top: 6px;
  font-size: 16px;
  color: #333;

  &.result {
    font-weight: 500;
  }
`;

export const QrReaderBox = styled.div.attrs({ id: 'qr-reader' })`
  width: 80%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  overflow: hidden;
  background-color: #000;
  border-radius: 12px;

  & video {
    transform: scaleX(1) rotate(0deg) !important;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export const DesktopNotice = styled.div`
  max-width: 720px;
  margin: auto auto 0; /* прижимаем к низу на ПК */
  padding: 12px 14px;
  border-radius: 10px;
  background: #f7f7f7;
  color: #2c3e50;
  font-size: 14px;
  text-align: center;
  border: 1px solid #ececec;
`;
