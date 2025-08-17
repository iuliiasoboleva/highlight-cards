import styled from 'styled-components';

export const ClientsContainer = styled.div`
  padding: 20px;
`;

export const ClientsTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
`;

/* ===== Статистика ===== */
export const ClientsStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const ClientsStatCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

export const StatClientsValue = styled.span`
  display: block;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const StatClientsLabel = styled.span`
  color: #7f8c8d;
  font-size: 14px;
  text-align: left;
`;

export const PushDescription = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  text-align: left;
`;

export const LoyaltyStars = styled.div`
  font-size: 24px;
  color: #f1c40f;
  margin-top: 10px;
`;

/* ===== Экшены ===== */
export const ClientsActionsBar = styled.div`
  margin: 30px 0;
`;

export const ClientsAddButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

/* ===== Список клиентов ===== */
export const ClientsListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const ClientCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ClientAvatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  margin-right: 20px;
`;

export const ClientDetails = styled.div`
  flex: 1;
`;

export const ClientName = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
`;

export const ClientMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  color: #7f8c8d;
`;

export const ClientMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

/* ===== Модалка добавления ===== */
export const ClientsModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999900;
`;

export const ClientsModal = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

export const ClientsModalTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
`;

export const ClientsModalFormGroup = styled.div`
  margin-bottom: 15px;
`;

export const ClientsModalInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

export const ClientsModalActions = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const ClientsModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;
`;

export const ClientsModalButtonPrimary = styled(ClientsModalButton)`
  background-color: black;
  color: white;
  border: none;
`;

export const ClientsModalButtonSecondary = styled(ClientsModalButton)`
  background-color: #f5f5f5;
`;

export const FooterCardDescription = styled.p`
  color: #7f8c8d;
  margin-bottom: 20px;
`;

/* ===== Иконки (как псевдоэлементы) ===== */
const IconBase = styled.span`
  &::before {
    display: inline-block;
    margin-right: 4px;
  }
`;

export const IconCalendar = styled(IconBase)`
  &::before {
    content: '📅';
  }
`;

export const IconPhone = styled(IconBase)`
  &::before {
    content: '📞';
  }
`;

export const IconBirthday = styled(IconBase)`
  &::before {
    content: '🎂';
  }
`;

/* ===== Tooltip ===== */
export const ClientsTooltipWrapper = styled.span`
  position: relative;
  display: inline-block;

  &:hover .clients-tooltip {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const ClientsTooltip = styled.span.attrs({ className: 'clients-tooltip' })`
  position: absolute;
  bottom: 100%;
  right: 20px;
  background-color: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transform: translateY(-4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
`;

/* ===== Link + copy ===== */
export const LinkContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;

  input {
    width: 100%;
  }
`;

export const CopyLinkButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
`;

/* ===== Карточка менеджера (адаптив) ===== */
export const ManagerCard = styled.div`
  @media (max-width: 999px) {
    width: 100%;
  }
`;

export const Label = styled.p`
  font-size: 12px;
  color: #656565;
  line-height: 1.66667;
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
`;

export const BranchesScrollContainer = styled.div`
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px;
`;

export const PushCard = styled(ClientsStatCard)`
  /* те же визуальные параметры, что и у ClientsStatCard уже есть */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  min-height: 120px; /* чтобы по высоте не отличалась от стат-карт */
`;

export const PushCardWrapper = styled.div`
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  max-width: 100%;
`;

export const SectionHeading = styled.h4`
  margin: 32px 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PushActions = styled.div`
  margin-top: 12px;
`;
