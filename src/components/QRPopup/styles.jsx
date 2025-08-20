import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const QRBlock = styled.div`
  display: grid;
  place-items: center;
  gap: 12px;
  margin: 8px 0 12px;
`;

export const QRLink = styled.p`
  margin: 0;
  word-break: break-all;
  text-align: center;
  color: #0066cc;
  font-size: 14px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;

  /* На узких экранах — в столбик */
  @media (max-width: 480px) {
    flex-direction: column;
    justify-content: stretch;

    & > * {
      width: 100%;
    }
  }
`;

/* Если понадобится блок информации — раскомментируй:
export const InfoCard = styled.div`
  background: #f5f5f5;
  padding: 12px 14px;
  border-radius: 10px;
`;

export const InfoTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;
*/
