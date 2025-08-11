import styled from 'styled-components';

export const Page = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Subtitle = styled.h3`
  font-weight: 500;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const Warning = styled.div`
  border: 1px solid #000;
  border-radius: 4px;
  padding: 16px;
  font-size: 18px;
  margin-bottom: 8px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTitle = styled.h4`
  margin: 0 0 16px 0;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.5;
`;

export const Field = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.p`
  font-size: 12px;
  color: #656565;
  line-height: 1.66667;
`;

export const MainButton = styled.button`
  background: #1f1e1f;
  color: #fff;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background: #111;
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

/** ---- Таблица (styled-components) ---- */
export const TableWrap = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
`;

export const TableTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  width: 100%;

  @media (min-width: 768px) {
    white-space: nowrap;
  }
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #1f1e1f;

  &:last-child {
    text-align: right;
    width: 180px;
    white-space: nowrap;
  }
`;

export const EmptyCell = styled.td`
  padding: 16px;
  text-align: center;
  color: #9aa1a8;
  font-style: italic;
`;
