import styled, { css } from 'styled-components';

import { BarcodeRadioTitle } from '../EditDesign/styles';

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

export const SettingsInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
`;

export const SubtitleText = styled.p`
  display: block;
  font-size: 12px;
  color: #656565;
  line-height: 1.6667;
  font-weight: 400;
  margin: 0;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #eaeaea;
  margin: 16px 0;
`;

export const LabeledTextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PolicyTextareaWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const RequiredAsterisk = styled.span`
  color: #bf4756;
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;

  @media (min-width: 1450px) {
    flex-direction: row;
  }
`;

export const Wrapper = styled.div`
  flex: 1;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr 40px;
  align-items: center;
  gap: 20px;
  margin-bottom: 4px;

  span {
    font-size: 12px;
    font-weight: 400;
    color: #656565;
    line-height: 1.6667;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr 40px;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    > button {
      justify-self: flex-end;
    }
  }
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

export const PolicySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PolicyHeader = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    row-gap: 8px;

    ${BarcodeRadioTitle} {
      grid-column: 1 / -1;
    }
  }
`;

export const Spacer = styled.div`
  height: 8px;
`;

export const AdditionalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ControlsBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

/* Лейбл секции (как в EditDesign) */
export const StampSectionLabel = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const QuantityHeader = styled(StampSectionLabel)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

/* Подзаголовки/описания */
export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
`;
export const Subnote = styled.p`
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 400;
`;

const BP = '680px';

/* Сетка круглых кнопок с количествами */
export const QuantityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;

  @media (max-width: ${BP}) {
    justify-content: center;
  }
`;

/* Кнопка количества (аналог StampQuantityButton) */
export const QuantityButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #d5d5dd;
  background: #fff;
  color: #9f9fa7;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
  }

  ${({ $active }) =>
    $active &&
    css`
      background: #000;
      color: #fff;
      border-color: #000;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
