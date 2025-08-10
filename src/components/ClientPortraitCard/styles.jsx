import styled from 'styled-components';

export const PortraitCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  min-height: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const PortraitTitle = styled.div`
  font-size: 16px;
  color: #111827;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  flex: 1;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Legend = styled.div`
  margin-top: 8px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: 0 0 10px;
`;

export const LegendText = styled.span`
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
