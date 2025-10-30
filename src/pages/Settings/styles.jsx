import styled, { css, keyframes } from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  min-height: calc(100vh - var(--header-height) - var(--bar-height));

  @media (max-width: 1100px) {
    min-height: auto;
  }
`;

export const HeaderCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  background: #f3f5f6;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const Subtle = styled.div`
  color: #8a94a6;
  font-size: 13px;
  margin-bottom: 4px;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
`;

export const QuestionIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8a94a6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #4a5568;
  }
`;

export const TooltipContent = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  transition:
    opacity 0.2s,
    visibility 0.2s;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #2d3748;
  }
`;

export const RightMeta = styled.div`
  display: grid;
  justify-items: flex-end;
  gap: 6px;

  @media (max-width: 768px) {
    justify-items: flex-start;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: flex-end;
  color: #8a94a6;
  font-size: 13px;
  gap: 2px;

  .duration {
    flex-direction: column;
  }

  b {
    font-weight: 800;
    color: #000;
    text-align: left;
  }

  @media (max-width: 768px) {
    align-items: flex-start;

    .duration {
      flex-direction: row;
    }

    b {
      text-align: right;
    }
  }
`;

export const Benefit = styled.div`
  background: #e9fbef;
  color: #0f7a3b;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  padding: 10px 12px;
  width: 100%;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 16px;
  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const AsideCard = styled.div`
  position: sticky;
  top: 12px;
  height: fit-content;
`;

export const BlockTitle = styled.div`
  font-weight: 800;
  font-size: 13px;
  margin-bottom: 14px;
`;

export const Plans = styled.div`
  display: grid;
  gap: 24px;
  margin-top: 30px;

  @media (max-width: 1100px) {
    margin-top: auto;
  }
`;

export const PlanCard = styled.div`
  position: relative;
  border: 1px solid #e6e8ee;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 150px;
  transition:
    0.2s ease border-color,
    0.2s ease box-shadow;

  &:hover {
    border-color: gray;
  }

  ${(p) =>
    p.$active &&
    css`
      border-color: #c9353f;
      background: #fdebed;
      &:hover {
        border-color: #a82c35;
      }
    `}

  ${(p) =>
    p.$current &&
    css`
      border-color: #c9353f;
      background: transparent;
      &:hover {
        border-color: #a82c35;
      }
    `}
`;

export const PopularBadge = styled.div`
  position: absolute;
  left: 12px;
  top: -8px;
  background: #c9353f;
  color: #fff;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
`;

export const CurrentBadge = styled.div`
  position: absolute;
  right: 12px;
  top: -8px;
  background: #0f7a3b;
  color: #fff;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  gap: 10px;
`;

export const Radio = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #c5c9d3;
  position: relative;

  ${(p) =>
    p.$checked &&
    css`
      border-color: #c9353f;
      background: #c9353f;
      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: #c9353f;
      }
    `}
`;

export const PlanName = styled.div`
  font-weight: 700;
`;

export const PlanDesc = styled.div`
  color: #6a7282;
  font-size: 14px;
  margin: 6px 0 10px;
  white-space: pre;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: auto;
`;

export const PlanPrice = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

export const Field = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;

  span {
    color: #868083;
  }

  strong {
    font-weight: 600;
  }
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #8a94a6;
`;

export const CalcLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;

  b {
    font-weight: 600;
    font-size: 14px;
  }
`;

export const Total = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  font-size: 14px;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #eef0f4;
  font-weight: 600;

  b {
    font-size: 18px;
    font-weight: 800;
  }
`;

const shine = keyframes`
  0% { left: -40%; }
  100% { left: 140%; }
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  background: #c4343c;
  cursor: pointer;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;

  &:hover,
  &:focus,
  &:active {
    background: #c4343c;
    outline: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -40%;
    width: 40%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg);
    pointer-events: none;
  }

  &:hover::before {
    animation: ${shine} 0.9s ease;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GhostBtn = styled.button`
  width: 100%;
  border: 1px solid #e6e8ee;
  background: #fff;
  color: #000;
  border-radius: 8px;
  padding: 8px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
`;

export const SmallList = styled.ul`
  margin: 16px 0 0 0;
  padding: 0;
  list-style: none;
  color: gray;
  font-size: 10px;
  font-weight: 200;
  font-family:
    'Manrope',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: grid;
  gap: 6px;

  li {
    margin: 0;
    padding: 0;
    position: relative;
  }

  li::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    vertical-align: middle;
    margin-right: 3px;
  }
`;

export const ConditionsCard = styled.div`
  background: #fff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
`;
export const RangeWrap = styled.div`
  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    outline: none;
  }

  input[type='range']:focus {
    outline: none;
  }
  input[type='range']:focus-visible {
    outline: none;
  }
  input[type='range']::-moz-focus-outer {
    border: 0;
  }
  input[type='range']::-moz-focus-inner {
    border: 0;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 14px;
    border-radius: 999px;
    background:
      linear-gradient(#030514 0 0) left/var(--pct, 0%) 100% no-repeat,
      #edecf0;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #030514;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease;
  }
  input[type='range']:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 4px rgba(3, 5, 20, 0.2);
  }

  input[type='range']::-moz-range-track {
    height: 14px;
    border-radius: 999px;
    background: #edecf0;
  }

  input[type='range']::-moz-range-progress {
    height: 14px;
    border-radius: 999px;
    background: #030514;
  }

  input[type='range']::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #030514;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease;
  }
  input[type='range']:focus::-moz-range-thumb {
    box-shadow: 0 0 0 4px rgba(3, 5, 20, 0.2);
  }

  input[type='range']:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FreeBox = styled.div`
  text-align: center;
`;

export const FreeTitle = styled.div`
  color: #c31e3c;
  text-align: center;
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 6px;
`;

export const FreeSub = styled.div`
  color: #535252;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const MutedNote = styled.div`
  color: #535252;
  font-size: 10px;
  font-weight: 500;
  margin-top: 8px;
  text-align: center;
`;

export const SalesBox = styled.div`
  border: 1px solid #c31e3c;
  background: #fef2f2;
  color: oklch(0.505 0.213 27.518);
  border-radius: 14px;
  padding: 20px;
  white-space: pre;

  p {
    margin: 0 0 12px;
    line-height: 1.35;
    font-size: 12px;
    font-weight: 500;
  }
`;
export const SalesBtn = styled.button`
  border: none;
  background: #c31e3c;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
`;

export const PromoWrapper = styled.div`
  margin: 16px 0;
  padding-top: 16px;
  border-top: 1px solid #eef0f4;
`;

export const PromoLabel = styled.div`
  font-size: 12px;
  color: #868083;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const PromoInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

export const PromoInput = styled.input`
  flex: 1;
  border: 1px solid #e6e8ee;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #c4343c;
    box-shadow: 0 0 0 3px rgba(196, 52, 60, 0.1);
  }

  &::placeholder {
    text-transform: none;
    font-weight: 400;
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PromoApplyBtn = styled.button`
  border: 1px solid #c4343c;
  background: #fff;
  color: #c4343c;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #c4343c;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #e6e8ee;
    color: #aaa;
  }
`;

export const PromoMessage = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;

  ${(p) =>
    p.$success &&
    css`
      background: #e9fbef;
      color: #0f7a3b;
    `}

  ${(p) =>
    p.$error &&
    css`
      background: #fee;
      color: #c4343c;
    `}
`;

export const PromoDiscount = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
  color: #0f7a3b;
  font-weight: 600;
  margin-top: 8px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
