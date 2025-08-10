import styled from 'styled-components';

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
`;

export const Subtitle = styled.h2`
  font-size: 20px;
  margin: 8px 0 12px;
  font-weight: 500;
  line-height: 1.3;
  color: #1f1e1f;
`;

export const PortraitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
