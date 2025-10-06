import styled, { css } from 'styled-components';

export const GroupWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 600;
  color: #2c3e50;
`;

export const Subtitle = styled.p`
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #7f8c8d;
`;

export const AdditionalBox = styled.div`
  margin-top: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

export const LocationInfo = styled.div`
  display: grid;
  gap: 4px;
  padding: 8px 10px;
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
  color: #2c3e50;
  font-size: 13px;
`;

export const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

export const AddressWrap = styled.div`
  position: relative;
`;

export const SuggestList = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  max-height: 260px;
  overflow: auto;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
`;

export const SuggestItem = styled.li`
  padding: 10px 12px;
  font-size: 14px;
  color: #e9e9e9;
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.35;

  ${({ $active }) =>
    $active &&
    css`
      background: rgba(255, 255, 255, 0.06);
    `}

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const LimitNote = styled.div`
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #1f1f1f;
  border: 1px solid #383838;
  color: #f1f1f1;
  font-size: 14px;

  b {
    color: #9be169;
  }
`;

export const RowBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const EditLink = styled.button`
  background: none;
  border: none;
  color: #8ab4ff;
  cursor: pointer;
  padding: 0;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`;

export const SmallGray = styled.span`
  font-size: 12px;
  color: #a0a0a0;
`;

export const SettingsInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  & .flash-border {
    animation: flashBorder 1s ease;
  }

  @keyframes flashBorder {
    0% {
      box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7);
    }
    100% {
      box-shadow: 0 0 0 6px rgba(74, 144, 226, 0);
    }
  }
`;

export const FullWidthHr = styled.hr`
  width: 100%;
`;

export const EmptyLocations = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;

  font-size: 14px;
  cursor: pointer;
  gap: 8px;
`;

export const EmptyLocationsButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }
`;

/* ==== УНИФИЦИРОВАННЫЕ ЗАГОЛОВКИ ==== */
export const SectionTitle = Title; // алиас
export const SectionSubTitle = styled(Title)`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

/* === ЛОКАЦИИ: как TagWrapper === */
export const LocationsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border: 1px solid #d5d5dd;
  border-radius: 4px;
  padding: 10px 12px;
`;

export const LocationTag = styled.div`
  padding: 8px 12px;
  background-color: transparent;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d5d5dd;
  cursor: pointer;
`;

export const TagIconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-weight: bold;
  margin-left: 4px;
  margin-top: 2px;
  cursor: pointer;
  color: inherit;

  &:hover {
    color: #000;
  }
`;

export const SmallActionButton = styled(LocationTag).attrs({ as: 'button', type: 'button' })``;

export const Section = styled.div`
  ${({ $bordered }) =>
    $bordered
      ? `
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 12px 8px;
  `
      : ''}
`;

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

export const StampSectionLabel = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const Warning = styled.div`
  background-color: #ffa500;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const HintDanger = styled.div`
  background-color: #fff;
  color: #333;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e53935;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

export const PolicyBorderedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 360px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const PolicyBordered = Section;

export const SpanHint = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: rgb(101, 101, 101);
  line-height: 1.66667;
`;

export const SubTitle = styled.span`
  font-size: 12px;
  color: #888;
`;

export const gridTemplate = '3fr 3fr 1fr 1fr';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${gridTemplate} 1fr;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #d00;
  }

  & svg {
    width: 20px;
    height: 20px;
  }
`;

export const AddBtn = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #000;
  }
`;

export const TextareaWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const Asterisk = styled.span`
  position: absolute;
  top: 4px;
  right: 8px;
  color: #888;
`;

export const LinkCell = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;

  a {
    overflow-wrap: anywhere;
    text-decoration: none;
  }
`;

export const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  padding: 0;

  &:hover {
    color: #000;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const DurationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

export const SpendingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
`;

export const SpendingLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Equal = styled.span`
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
`;

export const VisitConfig = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
`;

export const VisitLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HEADER_PAD_LEFT = '12px';

const BP = '680px';

export const HeaderLabel = styled(SpanHint)`
  padding-left: ${HEADER_PAD_LEFT};
`;
export const HeaderLabelCenter = styled(SpanHint)`
  justify-self: center;
`;
export const HeaderLabelTrash = styled.span`
  justify-self: center;
`;

export const NamePlaceholder = styled.span`
  font-size: 13px;
  color: #a0a0a0;

  @media (max-width: ${BP}) {
    display: none;
  }
`;

export const RequiredLabel = styled.span`
  display: none;
  font-size: 13px;
  color: #656565;

  @media (max-width: ${BP}) {
    display: inline;
  }
`;

export const DeleteCell = styled(DeleteBtn)`
  @media (max-width: ${BP}) {
    grid-area: delete;
    justify-self: end;
    align-self: center;
  }
`;
const ISSUE_COLUMNS = '2fr 3fr 120px 40px';

export const IssueHeader = styled(Header)`
  grid-template-columns: ${ISSUE_COLUMNS};
  gap: 12px;
  align-items: end;
  margin-bottom: 6px;

  @media (max-width: ${BP}) {
    display: none;
  }
`;

export const IssueRow = styled(Row)`
  grid-template-columns: ${ISSUE_COLUMNS};
  gap: 12px;
  margin-bottom: 8px;
  align-items: center;

  & > * {
    min-width: 0;
  }

  @media (max-width: ${BP}) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'type delete'
      'name name'
      'required required';
    gap: 10px 12px;
    align-items: start;

    padding: 10px 12px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    background: #fff;
  }
`;

export const TypeCell = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  & > * {
    width: 100%;
  }
  @media (max-width: ${BP}) {
    grid-area: type;
  }
`;

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  & > * {
    width: 100%;
  }
  @media (max-width: ${BP}) {
    grid-area: name;
  }
`;

export const RequiredCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* центр для тумблера на десктопе */
  @media (max-width: ${BP}) {
    grid-area: required;
    justify-content: space-between;
    justify-self: stretch;
    gap: 8px;
  }
`;

const STATUS_COLUMNS = '2fr 3fr 120px 40px';

export const StatusIssueHeader = styled(Header)`
  grid-template-columns: ${STATUS_COLUMNS};
  gap: 12px;
  align-items: end;
  margin-bottom: 6px;

  @media (max-width: ${BP}) {
    display: none;
  }
`;

export const StatusIssueRow = styled.div`
  display: grid;
  grid-template-columns: ${STATUS_COLUMNS};
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;

  & > * {
    min-width: 0;
  }

  @media (max-width: ${BP}) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'type delete'
      'name name'
      'required required';
    gap: 10px 12px;
    align-items: start;
    padding: 10px 12px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    background: #fff;
  }
`;

export const CellBase = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  & > * {
    width: 100%;
    height: 38px;
  }
`;

export const StatusTypeCell = styled(CellBase)`
  @media (max-width: ${BP}) {
    grid-area: type;
  }
`;
export const StatusNameCell = styled(CellBase)`
  @media (max-width: ${BP}) {
    grid-area: name;
  }
`;
export const StatusRequiredCell = styled(CellBase)`
  justify-self: stretch;
  @media (max-width: ${BP}) {
    grid-area: required;
  }
`;
