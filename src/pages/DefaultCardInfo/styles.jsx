import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 16px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: space-between;

  h1 {
    font-size: 24px;
    margin: 0;
    font-weight: 700;
  }

  .tags {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    h1 {
      font-size: 20px;
    }
  }
`;

export const HeaderButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StateTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  background: #e9eaef;
  color: #333;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 6px;
    gap: 4px;
  }
`;

export const StatusIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background: ${(p) => (p.$active ? '#2ecc71' : '#e74c3c')};

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CardSurface = `
  background-color: #fff;
  border-radius: 0.4rem;
  border: 0.1rem solid #d5d5dd;
  box-shadow: 0 0.4rem 2rem #4c48610d;
`;

export const PhoneContainer = styled.div`
  ${CardSurface};
  padding: 1.5rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FrameImg = styled.img`
  width: 280px;
  height: auto;
  object-fit: cover;

  @media (max-width: 768px) {
    width: auto;
    height: auto;
    max-width: 100%;
  }
`;

export const OverlayWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
`;

export const CardWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const QrContainer = styled.div`
  ${CardSurface};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 300px;
  width: 100%;

  button {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const QrBase = `
  border: 0.1rem solid #d5d5dd;
  box-shadow: 0 0.4rem 2rem #4c48610d;
  border-radius: 0.4rem;
  width: 100%;
`;

export const QrImage = styled.img`
  ${QrBase};
  padding: 10px 20px;
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
`;

export const QrLink = styled.div`
  ${QrBase};
  padding: 10px 20px;
  text-align: left;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  max-width: 100%;
  width: 100%;
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: #333;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  .table-name {
    margin: 0 0 8px 0;
  }
`;
