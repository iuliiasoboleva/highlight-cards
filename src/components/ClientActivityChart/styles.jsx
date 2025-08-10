import styled from 'styled-components';

export const StatisticsCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 12px 4px;
`;

export const ClientStatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px;
`;

export const ClientStatLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ClientStatRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ClientStatTitle = styled.span`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  color: #333;
`;

export const ClientStatSubtitle = styled.span`
  font-size: 32px;
  line-height: 1;
  color: #333;
`;

/* индикатор изменения */
export const ChangeValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  &.positive {
    color: #16a34a;
  } /* зелёный */
  &.negative {
    color: #dc2626;
  } /* красный */
  &.neutral {
    color: #6b7280;
  } /* серый */
`;

export const ChangeWrapper = styled.div`
  display: flex;
  align-items: center;

  &.positive .circle {
    background: rgba(22, 163, 74, 0.12);
  }
  &.negative .circle {
    background: rgba(220, 38, 38, 0.12);
  }
  &.neutral .circle {
    background: rgba(107, 114, 128, 0.12);
  }
`;

export const ChangeCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
`;

export const ChangeIcon = styled.span`
  display: inline-flex;
  &.positive {
    color: #16a34a;
  }
  &.negative {
    color: #dc2626;
  }
  &.neutral {
    color: #6b7280;
  }
`;

export const StatisticsContent = styled.div`
  display: flex;
`;

export const StatisticsLeft = styled.div`
  flex: 1 1 auto;
`;

export const ChartWrapper = styled.div`
  display: flex;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 8px;
`;
