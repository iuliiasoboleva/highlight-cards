import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

export const Trigger = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #d1d1d1;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #fff;

  /* шахматка */
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(#0000 25%, #0002 0 50%, #0000 0 75%, #0002 0) 0 0/10px 10px;
    border-radius: 10px;
  }
  /* сам цвет с альфой */
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $color }) => $color};
    border-radius: 10px;
    opacity: ${({ $alpha }) => ($alpha != null ? $alpha / 100 : 1)};
  }
`;

export const Popover = styled.div`
  position: absolute;
  z-index: 10006;
  left: 0;

  /* динамическая сторона */
  ${({ $placement }) =>
    $placement === 'top'
      ? css`
          bottom: calc(100% + 8px);
        `
      : css`
          top: calc(100% + 8px);
        `}
`;

export const Panel = styled.div`
  width: 336px;
  background: #f6f6f7;
  border: 1px solid #dedee3;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
  padding: 12px;
  position: relative;
`;

export const Tail = styled.div`
  position: absolute;
  left: 28px;
  width: 16px;
  height: 16px;
  background: #f6f6f7;

  ${({ $placement }) =>
    $placement === 'top'
      ? css`
          top: auto;
          bottom: -8px;
          border-bottom: 1px solid #dedee3;
          transform: rotate(45deg);
        `
      : css`
          top: -8px;
          bottom: auto;
          border-top: 1px solid #dedee3;
          transform: rotate(45deg);
        `}
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 2px 8px 2px;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2b2b2f;
`;

export const Close = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2b2b2f;
  &:hover {
    background: #e9e9ee;
  }
`;

export const SelectFake = styled.input.attrs({ readOnly: true })`
  width: 100%;
  height: 30px;
  padding: 0 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #dedee3;
  font-size: 12px;
  color: #2b2b2f;
  background: #ffffff;
`;

export const Grid = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 8px;
  border: 1px solid #dedee3;
  overflow: hidden;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 12}, 1fr);
`;

export const GridCell = styled.button`
  border: none;
  padding: 0;
  cursor: pointer;
  height: calc(220px / 10);
`;

export const SectionLabel = styled.div`
  margin-top: 12px;
  font-size: 11px;
  color: #6c6c72;
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
`;

export const Bar = styled.input.attrs({ type: 'range', min: 0, max: 100 })`
  flex: 1;
  appearance: none;
  height: 12px;
  border-radius: 999px;
  outline: none;
  border: 1px solid #d5d5dd;

  ${({ $rgb }) => {
    const { r = 0, g = 0, b = 0 } = $rgb || {};
    return css`
      background:
        conic-gradient(#0000 25%, #0002 0 50%, #0000 0 75%, #0002 0) 0 0/12px 12px,
        linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 1));
    `;
  }};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #6a6a70;
    cursor: pointer;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #6a6a70;
    cursor: pointer;
  }
`;

export const Percent = styled.div`
  width: 56px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: #2b2b2f;
  background: #ffffff;
  border: 1px solid #d5d5dd;
`;

export const Dots = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Dot = styled.button`
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #000;

  /* белое кольцо-обводка у выбранного */
  & > span {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #000;
    pointer-events: none;
  }
`;

export const PlusBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px dashed #c9c9cf;
  background: #ffffff;
  color: #a2a2aa;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
`;

export const Footer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  align-items: center;
`;
export const HexInput = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #d1d1d1;
  font-size: 14px;
  outline: none;
`;
