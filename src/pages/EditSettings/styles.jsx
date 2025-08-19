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
