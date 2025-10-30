import { Link } from 'react-router-dom';

import styled, { css } from 'styled-components';

export const SubmenuWrapper = styled.div`
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  height: var(--bar-height);
  background-color: #2e2e2e;
  border-bottom: 1px solid #333;
  padding: 0;
  z-index: 900;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 999px) {
    top: var(--header-mobile-height);
    position: static;
  }
`;

export const SubmenuInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px 10px 20px;
  min-width: max-content;
  height: 100%;

  @media (max-width: 999px) {
    padding: 10px 16px;
  }
`;

export const SubmenuLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const SubmenuCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-width: 0;
  ${({ $grow }) =>
    $grow &&
    css`
      flex: 1;
    `}
`;

export const SubmenuRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
`;

export const PageIcon = styled.div`
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  border: 1px solid #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
`;

export const NameEditor = styled.div`
  position: relative;
  display: inline-block;
`;

export const CardNameInput = styled.input`
  background: #1f1e1f;
  border: 1px solid #666;
  color: #fff;
  padding: 12px 18px;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
  outline: none;
`;

export const RequiredStar = styled.span`
  position: absolute;
  top: 4px;
  right: 8px;
  color: #c14857;
  font-size: 14px;
  pointer-events: none;
`;

export const baseTabStyles = css`
  font-size: 14px;
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
  text-align: center;
  white-space: nowrap;
  background-color: transparent;
  border: none;
  padding: 12px 18px;
  color: #aeaeae;
`;

export const TabLink = styled(Link)`
  ${baseTabStyles}
  ${({ $active }) =>
    $active &&
    css`
      color: white;
      border-color: transparent;
      font-family: 'Manrope', system-ui;
    `}
`;

export const TabButton = styled.button`
  ${baseTabStyles}
  position: relative;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: auto;

      &:hover {
        opacity: 0.6;
      }
    `}
`;

export const IconButton = styled.button`
  background: #454545;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 12px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: white;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:disabled {
    background: #2a2a2a;
    border-color: #444;
    color: #888;
    cursor: not-allowed;

    &:hover {
      background: #2a2a2a;
    }
  }
`;

export const SaveButton = styled.button`
  background: #454545;
  color: #fff;
  border: 1px solid #555;
  padding: 12px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

   &:disabled {
    background: #2a2a2a;
    border-color: #444;
    color: #888;
    cursor: not-allowed;

    &:hover {
      background: #2a2a2a;
    }
`;
