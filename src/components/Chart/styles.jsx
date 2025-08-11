import styled from 'styled-components';

/* ===== layout / заголовки ===== */
export const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const TitleFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Subtitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const ChartSubtitle = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
`;

/* ===== фильтры периода ===== */
export const Filters = styled.div`
  display: flex;
  gap: 8px;
  position: relative;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const FilterButton = styled.button`
  padding: 12px 18px;
  font-size: 14px;
  background-color: #ffffff;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  gap: 4px;
  display: flex;
  align-items: center;
  color: #656565;

  &:hover {
    background-color: #e9e9ec;
    color: #1f1e1f;
  }

  &.active {
    background-color: #e9e9ec;
    color: #1f1e1f;
  }

  @media (max-width: 768px) {
    padding: 8px;
    justify-content: center;
    flex-direction: column;
  }
`;

/* ===== блок статистики над графиком ===== */
export const StatisticsHeader = styled.div`
  font-weight: 500;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #777;
`;
export const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
export const StatChange = styled.div`
  font-size: 14px;
  color: #999;
`;

/* ===== графики ===== */
export const ChartWrapper = styled.div`
  display: flex;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 8px;
`;

/* ===== легенда / показатели клиентов ===== */
export const ClientStats = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

export const ClientStat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ClientDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &.purple {
    background-color: #8884d8;
  }
  &.light-purple {
    background-color: #ffc658;
  }
  &.green {
    background-color: #82ca9d;
  }
`;

export const ClientLabel = styled.span`
  font-size: 14px;
  color: #333;
`;

export const ClientValue = styled.span`
  margin-left: auto;
  font-size: 16px;
  font-weight: bold;
`;

/* ===== дата-пикер контейнер ===== */
export const DatepickerWrapper = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  opacity: 1;
  transition: opacity 0.2s ease;
  z-index: 1000;
`;

/* ===== общий контейнер ===== */
export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
`;

export const FiltersBlock = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #555;
  font-weight: 500;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    gap: 4px;
    justify-content: center;
    flex-direction: column;
  }
`;

/* ===== простые тултипы (локальные) ===== */
export const StatTooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
`;
export const StatTooltipIcon = styled.span`
  margin-left: 6px;
  color: #888;
  cursor: pointer;
  font-size: 14px;
`;
export const StatTooltipBox = styled.div`
  position: absolute;
  top: 120%;
  left: 0;
  z-index: 100;
  background-color: #fff;
  color: #333;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 220px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ChartsBlock = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
