// styles.jsx
import styled, { css } from 'styled-components';

/* =========================
   БАЗОВЫЕ КОМПОНЕНТЫ
   ========================= */
export const FlexRowBase = styled.div`
  display: flex;
  ${({ $gap }) =>
    $gap != null &&
    css`
      gap: ${typeof $gap === 'number' ? `${$gap}px` : $gap};
    `}
  ${({ $align }) =>
    $align &&
    css`
      align-items: ${$align};
    `}
  ${({ $justify }) =>
    $justify &&
    css`
      justify-content: ${$justify};
    `}
  ${({ $wrap }) =>
    $wrap &&
    css`
      flex-wrap: ${$wrap};
    `}
  ${({ $margin }) =>
    $margin &&
    css`
      margin: ${$margin};
    `}
`;

export const ParagraphBase = styled.p`
  margin: 0;
  font-size: 14px;
  color: #2c3e50;
`;

export const CardBase = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 10px 16px;
  transition:
    background 0.2s,
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.1);
  }
`;

/* =========================
   КОНТЕЙНЕРЫ / ЗАГОЛОВКИ
   ========================= */
export const ClientsContainer = styled.div`
  padding: 20px;
`;

export const ClientsTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
`;

/* =========================
   СТАТИСТИКА
   ========================= */
export const ClientsStatsGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;

  /* максимум 3 в ряд */
  grid-template-columns: 1fr;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ClientsStatCard = styled(CardBase)`
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

/* =========================
   ОПИСАНИЯ / ТЕКСТЫ
   ========================= */
export const Description = styled(ParagraphBase)`
  margin: 0 0 16px;
`;

export const PushDescription = styled(ParagraphBase)`
  color: #7f8c8d;
`;

export const FooterCardDescription = styled(ParagraphBase)`
  color: #7f8c8d;
  margin-bottom: 20px;
`;

export const Hint = styled(ParagraphBase)`
  margin: 0 0 12px 0;
`;

export const LoyaltyStars = styled.div`
  font-size: 24px;
  color: #f1c40f;
  margin-top: 10px;
`;

/* =========================
   ЭКШЕНЫ
   ========================= */
export const ClientsActionsBar = styled.div`
  margin: 30px 0;
`;

export const ClientsAddButton = styled(ButtonBase)`
  background-color: black;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;

  &:hover {
    background-color: #2980b9;
  }
`;

export const GhostButton = styled(ButtonBase)`
  padding: 8px 12px;
  border: 1px dashed #c9c9c9;
  background: #fff;
  color: #2c3e50;

  &:hover {
    background: #fafafa;
  }
`;

/* =========================
   СПИСОК КЛИЕНТОВ
   ========================= */
export const ClientsListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const ClientCard = styled(CardBase)`
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

export const ClientMetaItem = styled(FlexRowBase).attrs({ $gap: 5, $align: 'center' })``;

/* =========================
   ФОРМА / МОДАЛКИ (частично)
   ========================= */
export const ClientsModalFormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

export const CheckboxRow = styled(FlexRowBase).attrs({ $gap: 4, $align: 'center' })``;

/* =========================
   PUSH-КАРТОЧКА
   ========================= */
export const PushCard = styled(ClientsStatCard)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
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

/* =========================
   ВСПОМОГАТЕЛЬНЫЕ
   ========================= */
export const ErrorText = styled.div`
  color: #e53935;
  font-size: 12px;
  margin-top: 6px;
`;

export const LinkContainer = styled(FlexRowBase).attrs({ $gap: 8 })`
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

export const Row = styled(FlexRowBase).attrs({ $align: 'center', $gap: 10 })``;

export const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

/* =========================
   TOOLTIP
   ========================= */
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

/* =========================
   ИКОНКИ (псевдоэлементы)
   ========================= */
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

/* =========================
   ДОП. ХЕЛПЕРЫ ДЛЯ ПОВТОРНОГО ИСП.
   ========================= */
export const ActionsRow = styled(FlexRowBase).attrs({ $gap: 12, $wrap: 'wrap' })`
  button {
    max-width: 100%;
  }
`;
