import styled from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const PlanCard = styled.div`
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 48px 24px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;
  width: max-content;
  max-width: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PlanMainTitle = styled.h3`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 24px;
`;

export const PlanStatus = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
`;

export const PlanFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  width: 100%;
  max-width: 320px;

  &:nth-child(odd) {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PlanCategoryLeft = styled.div`
  width: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const PlanCategoryNumber = styled.span`
  font-weight: 600;
  color: #bf4756;
`;

export const PlanCategoryTitle = styled.span`
  font-weight: 600;
`;

export const PlanFeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PlanFeatureItem = styled.li`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

export const PlanCheck = styled.span`
  color: #bf4756;
`;

export const PlanPrice = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const PlanPriceValue = styled.span`
  font-size: 32px;
  font-weight: 600;
`;
