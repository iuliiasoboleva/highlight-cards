import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const TariffBoxes = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`;

export const TariffBox = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e2e2e9;
  padding: 16px;
  display: flex;
  align-items: center;
  min-height: 88px;
`;

export const TariffBoxLeft = styled(TariffBox)`
  width: 60% !important;
  align-items: center;

  @media (max-width: 999px) {
    width: 100% !important;
  }
`;

export const TariffBoxRight = styled(TariffBox)`
  width: 40% !important;

  @media (max-width: 999px) {
    width: 100% !important;
  }
`;

export const AvatarCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  margin-right: 16px;
`;

export const BoxContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Price = styled.div`
  font-size: 40px;
  font-weight: 600;
  line-height: 1;
  color: #111;
`;

export const Sub = styled.div`
  font-size: 12px;
  color: #777;
  margin-top: 4px;
`;

export const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CardTag = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
`;

export const NoCards = styled.p`
  color: #999;
  font-size: 14px;
  margin-top: 4px;
`;

export const StatGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 8px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  @media (max-width: 999px) {
    grid-template-columns: 1fr;
  }
`;

export const ClientDashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ClientDashboardStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  width: 100%;

  @media (max-width: 999px) {
    grid-template-columns: 1fr;
  }
`;

export const ClientLinkWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 16px;
  flex-direction: row;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`;

export const DashboardLinkCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 0 1px #e2e2e9;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

export const DashboardLinkUrl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;

  @media (max-width: 999px) {
    flex-wrap: wrap;
  }
`;

export const DashboardLinkText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: #111;
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: 999px) {
    max-width: 300px;
  }
`;

export const DashboardCopyBtnWrapper = styled.div`
  flex-shrink: 0;
`;

export const DashboardCopyBtn = styled.button`
  background: #111;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.3s ease;

  &[data-copied='true'],
  &.copied {
    background-color: #2ecc71;
  }
`;

const tone = (t) => {
  switch (t) {
    case 'positive':
      return { fg: '#2ecc71', bg: '#ecfbf3' };
    case 'negative':
      return { fg: '#e74c3c', bg: '#ffefef' };
    default:
      return { fg: '#c98a00', bg: '#fff6e0' };
  }
};

export const DashboardStatCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e2e2e9;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DashboardStatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const DashboardStatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${(p) => (p.$small ? '30px' : '24px')};
  font-weight: ${(p) => (p.$small ? 500 : 600)};
  line-height: 1.2;
`;

export const FormPopupButton = styled.button`
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid #cfcfd4;
  border-radius: 8px;
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  text-align: center;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const DashboardStatCounterButton = styled.span`
  display: flex;
  flex-direction: column;
  border: 1px solid #d5d5dd;
  border-radius: 6px;
  overflow: hidden;
  width: 24px;
  height: 48px;
  margin-right: 8px;
  flex: 0 0 auto;
`;

export const DashboardStatCounter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  background-color: #fff;
  color: #000;
  line-height: 1;

  &:hover {
    background-color: #f2f2f2;
  }
`;

export const DashboardRatingStars = styled.div`
  display: flex;
  gap: 4px;
  color: #ccc;
`;

export const Star = styled.span`
  color: #ccc;

  &[data-filled='true'] {
    color: #ffcc00;
  }
`;

export const DashboardTags = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ClientCardTag = styled.span`
  background-color: #1a1a1a;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
`;

export const DashboardAction = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const DashboardActionIcon = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  color: #999;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #111;
  }
`;

export const DatepickerWrapper = styled.div`
  position: absolute;
  top: 35px;
  left: -235px;
  z-index: 10000;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

export const DashboardPopupMenu = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 10;
  min-width: 120px;
`;

export const DashboardPopupMenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const ClientStatDropdownIconCircle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => tone(p.$type).bg};
  color: ${(p) => tone(p.$type).fg};
  border: none;
`;

export const DashboardStatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ClientStatDropdownChange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
export const ClientStatDropdownChangeValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => tone(p.$type).fg};
`;

export const DashboardNoData = styled.span`
  color: #999;
  font-size: 40px;
  font-weight: 500;
`;

export const TableName = styled.h2`
  font-size: 20px;
  line-height: 1.25;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;
