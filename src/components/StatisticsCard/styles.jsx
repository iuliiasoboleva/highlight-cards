import styled from 'styled-components';

export const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Header = styled.div`
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
`;

export const FiltersBlock = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #555;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: stretch;

  @media (max-width: 999px) {
    grid-template-columns: 1fr;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Right = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 0;
  height: 100%;
  border-left: 1px solid #eee;

  & > *:last-child {
    border-bottom: none;
  }

  @media (max-width: 999px) {
    border-left: none;
    grid-template-rows: none;
  }
`;

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 20px;

  @media (max-width: 999px) {
    display: flex;
    flex-direction: column;
  }
`;

export const ChartWrapper = styled.div`
  display: flex;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 8px;
`;
