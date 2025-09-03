import styled, { css } from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
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
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 8px;
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
  gap: 12px;
`;

export const PlanCard = styled.div`
  position: relative;
  border: 1px solid #e6e8ee;
  border-radius: 14px;
  padding: 14px 14px 12px;
  cursor: pointer;
  transition:
    0.2s ease border-color,
    0.2s ease box-shadow;

  ${(p) =>
    p.$active &&
    css`
      border-color: #ef4358;
      background: #fff5f6;
    `}
`;

export const PopularBadge = styled.div`
  position: absolute;
  left: 12px;
  top: -8px;
  background: #ef4358;
  color: #fff;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 8px;
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
      border-color: #ef4358;
      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: #ef4358;
      }
    `}
`;

export const PlanName = styled.div`
  font-weight: 600;
`;

export const PlanDesc = styled.div`
  color: #6b7280;
  font-size: 13px;
  margin: 6px 0 10px;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const PlanPrice = styled.div`
  font-weight: 600;
`;

export const Field = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.div`
  font-size: 14px;
  margin-bottom: 8px;

  strong {
    margin-left: 6px;
  }
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8a94a6;
  margin-top: 6px;
`;

export const CalcLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eef0f4;

  b {
    font-weight: 600;
  }
`;

export const Total = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  font-size: 16px;

  b {
    font-size: 18px;
  }
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  border: none;
  border-radius: 10px;
  height: 40px;
  font-weight: 600;
  color: #fff;
  background: #ef4358;
  cursor: pointer;
  margin-bottom: 8px;
`;

export const GhostBtn = styled.button`
  width: 100%;
  border: 1px solid #e6e8ee;
  background: #fff;
  color: #0b0c10;
  border-radius: 10px;
  height: 40px;
  font-weight: 600;
  cursor: pointer;
`;

export const SmallList = styled.ul`
  margin-top: 12px;
  color: #8a94a6;
  font-size: 12px;
  display: grid;
  gap: 6px;
`;

/* карточка */
export const ConditionsCard = styled.div`
  background: #fff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
`;

export const RangeWrap = styled.div`
  --track-h: 8px;
  --thumb: 18px;

  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
  }

  /* WebKit */
  input[type='range']::-webkit-slider-runnable-track {
    height: var(--track-h);
    border-radius: 999px;
    background:
      linear-gradient(#0b0c10 0 0) left/var(--pct, 0%) 100% no-repeat,
      #e6e9ef;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--thumb);
    height: var(--thumb);
    border-radius: 50%;
    background: #fff;
    border: 2px solid #0b0c10;
    margin-top: calc(var(--track-h) / -2 + var(--thumb) / -2 + var(--track-h) / 2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  /* Firefox */
  input[type='range']::-moz-range-track {
    height: var(--track-h);
    border-radius: 999px;
    background: #e6e9ef;
  }
  input[type='range']::-moz-range-progress {
    height: var(--track-h);
    border-radius: 999px;
    background: #0b0c10;
  }
  input[type='range']::-moz-range-thumb {
    width: var(--thumb);
    height: var(--thumb);
    border-radius: 50%;
    background: #fff;
    border: 2px solid #0b0c10;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }
`;

export const FreeBox = styled.div`
  text-align: center;
`;
export const FreeTitle = styled.div`
  color: #e11d2e;
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 6px;
`;
export const FreeSub = styled.div`
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
`;
export const MutedNote = styled.div`
  color: #9aa3af;
  font-size: 12px;
  margin-top: 10px;
`;

export const SalesBox = styled.div`
  border: 1px solid #f4c6cc;
  background: #fff5f6;
  color: #d12d3d;
  border-radius: 12px;
  padding: 16px;
  p {
    margin: 0 0 12px;
    line-height: 1.35;
  }
`;
export const SalesBtn = styled.button`
  border: none;
  background: #ef4358;
  color: #fff;
  font-weight: 600;
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
`;
