import styled from 'styled-components';

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;
  }
`;

export const StepNote = styled.span`
  margin-left: auto;
  color: #6b7280;
  font-size: 14px;

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #7f8c8d;
`;

export const StampSectionLabel = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
`;
