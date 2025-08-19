import styled, { css } from 'styled-components';

export const Page = styled.div`
  padding: 20px;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const Card = styled.div`
  background: linear-gradient(244.55deg, #d4d4e44d, #ffffff4d 66.12%), #fff;
  border-radius: 4px;
  border: 0.1rem solid #d5d5dd;
  padding: 24px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 250px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 14px;
    color: #656565;
    line-height: 1.4;
    max-width: 400px;
  }
`;

export const ScannerIcon = styled.span`
  width: 18px;
  position: absolute;
  top: 24px;
  right: 24px;
`;

export const ManagerEditButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
`;

export const TablesGroup = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 28px;

  @media (min-width: 992px) {
    margin-top: 32px;
  }
`;

export const TableName = styled.h2`
  font-size: 20px;
  line-height: 1.25;
  font-weight: 600;
  color: #1f2937;
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

export const Spacer = styled.span`
  flex: 1;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
`;

export const Hint = styled.p`
  margin: 0 0 12px 0;
  color: #7f8c8d;
  font-size: 14px;
`;

export const ErrorText = styled.div`
  color: #e53935;
  font-size: 12px;
  margin-top: 6px;
`;

export const IconWithTooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: help;

  svg {
    pointer-events: none;
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
    transform: translateY(-4px);
  }
`;

export const Tooltip = styled.span`
  position: absolute;
  bottom: 125%;
  right: 50%;
  transform: translateX(-50%);
  background: #111;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  min-width: 160px;
  max-width: 260px;
  white-space: normal;

  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #111 transparent transparent transparent;
  }
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
