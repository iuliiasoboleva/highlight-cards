import styled, { css } from 'styled-components';

export const LocationsSubtext = styled.p`
  font-size: 14px;
  margin-bottom: 12px;
`;

export const AddLocationBtn = styled.button`
  margin: 12px 0;
  width: 100%;
  padding: 14px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

export const LimitAlert = styled.div`
  background: #eaeaea;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  font-weight: 500;
  margin-bottom: 20px;
  margin-top: 16px;
`;

export const SearchLoading = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const LocationList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LocationCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.06);
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

export const LocationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DeleteLocationBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  color: #d00;
  transition: color 0.2s;

  &:hover {
    color: #a00;
  }
`;

export const PrimaryBtn = styled.button`
  padding: 11px 14px;
  background-color: #2e2e2e;
  color: #fff;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1.6px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    color: #bf4756;
    background-color: #f9edee;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
`;

export const ActionButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.15s ease;
  border: 1px solid transparent;
  user-select: none;
  white-space: nowrap;

  .icon {
    flex: 0 0 auto;
  }

  ${({ variant }) =>
    variant === 'primary'
      ? css`
          background: #111827;
          color: #fff;
          border-color: #111827;

          &:hover:not(:disabled) {
            opacity: 0.92;
          }
        `
      : css`
          background: #fff;
          color: #111827;
          border-color: #e5e7eb;

          &:hover:not(:disabled) {
            background: #f9fafb;
          }
        `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
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
