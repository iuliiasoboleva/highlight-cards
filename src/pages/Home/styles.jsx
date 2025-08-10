import styled from 'styled-components';

export const PortraitChart = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
`;

export const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
`;
