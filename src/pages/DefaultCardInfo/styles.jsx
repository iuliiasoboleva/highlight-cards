import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  h1 {
    font-size: 24px;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 18px;
    }
    flex-direction: column;
    align-items: flex-start;
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
`;

export const StatusIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background: ${(p) => (p.$active ? '#2ecc71' : '#e74c3c')};
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
  width: 290px;
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

export const QrContainer = styled.div`
  ${CardSurface};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  button {
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
`;

export const QrLink = styled.div`
  ${QrBase};
  padding: 10px 20px;
  text-align: center;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  flex-wrap: wrap;
  justify-content: center;
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
