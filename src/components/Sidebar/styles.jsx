import { Tooltip } from 'react-tooltip';

import styled from 'styled-components';

const ACCENT = '#C14857';
const ACTIVE_BG = '#F9EDEE';

export const StyledTooltip = styled(Tooltip)`
  background-color: #fff !important;
  color: #000 !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  padding: 6px 10px !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #e5e5e5 !important;
  z-index: 999999 !important;
  white-space: nowrap !important;
  position: fixed !important;
  pointer-events: none !important;
`;

export const SidebarNav = styled.nav`
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  padding-top: calc(var(--header-height) - 10px);
  background: #fff;
  border-right: 1px solid #ececec;
  z-index: 800;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  overflow-y: auto;
  overflow-x: visible;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b0b0b0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -14px;
    bottom: 0;
    width: 14px;
    pointer-events: none;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0) 85%);
  }

  @media (max-width: 999px) {
    display: none;
  }
`;

export const IconButton = styled.button`
  position: relative;
  border: 0;
  padding: 12px;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  transition: color 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #f3f4f6;
  }

  &.active {
    color: ${ACCENT};
    background: ${ACTIVE_BG};
  }

  @media (max-width: 999px) {
    padding: 10px;
    flex-direction: column;
    font-size: 10px;
    gap: 8px;
  }

  @media (max-width: 520px) {
    p {
      display: none;
    }
  }
`;

export const Glyph = styled.span.attrs({ 'aria-hidden': true })`
  width: 26px;
  height: 26px;
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url(${(p) => p.src}) no-repeat center / contain;
  mask: url(${(p) => p.src}) no-repeat center / contain;

  @media (max-width: 999px) {
    width: 20px;
    height: 20px;
  }
`;

export const BottomNav = styled.nav`
  display: none;

  @media (max-width: 999px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: #f8f8f8;
    height: var(--bottom-nav-height);
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    z-index: 9999;
    border-top: 1px solid #e0e0e0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  }
`;
