import styled, { keyframes } from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

export const Header = styled.header`
  display: none;
`;

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
  width: 90%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  overflow: hidden;
  background-color: #000;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  @media (min-width: 1000px) {
    width: 450px;
    max-width: 450px;
  }

  & video {
    transform: scaleX(1) rotate(0deg) !important;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
