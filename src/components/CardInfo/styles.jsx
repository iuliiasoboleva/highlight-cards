import styled from 'styled-components';

export const CardInfo = styled.div`
  position: absolute;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  color: rgb(31, 30, 31);
  background-color: #fff;
  padding: 12px 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 230px;
  width: 100%;
  height: 480px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 10px;
  font-weight: bold;

  &.preview-scaled {
    transform: translate(-50%, -50%) scale(0.85);
    padding: 10px 0;
    gap: 8px;
  }

  @media (max-width: 400px) {
    max-width: 185px;
    height: auto;
    gap: 4px;
  }
`;

export const CardInfoHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: flex-start;
  width: 100%;
  padding: 0 12px;
`;

export const CardInfoFooter = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 4px;
  row-gap: 4px;
  width: 100%;
  padding: 0 12px;
`;

export const CardInfoRow = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const CardInfoRowLabel = styled.div`
  flex: 1;
  min-width: 0;
  font-weight: 400;
  font-size: 8px;
  line-height: 16px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardInfoMainImgWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const CardInfoMainImg = styled.img`
  max-height: 88px;
  object-fit: cover;
  display: block;
  width: 100%;
  border-radius: 4px;
`;

export const QrBlock = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
`;

export const CardInfoQrImg = styled.img`
  max-width: 140px;
  width: 100%;
  align-self: center;
`;

export const CardInfoLogo = styled.img`
  width: 100%;
  max-width: 80px;
  height: 20px;
  object-fit: cover;
`;

export const StampOverlay = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

export const StampContainer = styled.div`
  width: 100%;
  height: 88px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
`;

export const StampRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  width: 100%;
`;

export const StampItem = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  padding: ${({ $padding }) => $padding}px;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  background-color: ${({ $bgColor }) =>
    typeof $bgColor === 'string' && $bgColor !== '' ? $bgColor : 'transparent'};

  border: ${({ $noBorder, $borderColor }) => ($noBorder ? 'none' : `2px solid ${$borderColor}`)};

  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  box-shadow: ${({ $hi, $hiBorder }) => {
    const list = [];
    if ($hi) list.push('0 0 0 2px #ff3b30');
    if ($hiBorder) list.push('inset 0 0 0 2px #ff3b30');
    return list.length ? list.join(', ') : 'none';
  }};

  transition:
    box-shadow 120ms ease,
    transform 80ms ease,
    background-color 120ms ease;

  &:hover {
    ${({ $clickable }) => $clickable && 'box-shadow: 0 1px 0 0 rgba(0,0,0,.06);'}
  }

  &:active {
    ${({ $clickable }) => $clickable && 'transform: translateY(0.5px);'}
  }

  &:focus-visible {
    outline: 2px solid #7c9af2;
    outline-offset: 2px;
  }
`;

export const StampImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const CardBackground = styled.div`
  background-color: rgb(246, 246, 246);
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  width: 100%;
`;

export const CardInfoTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;

  & > div:first-child {
    flex: 1 1 auto;
    min-width: 0;
  }

  &.android {
    border-bottom: 1px solid #d5d5dd;
    padding-bottom: 10px;
  }
`;

export const TopFieldsBlock = styled.div`
  display: flex;
  gap: 8px 12px;
  justify-content: flex-end;
  flex: 0 1 55%;
  min-width: 0;
  overflow: hidden;

  & > * {
    min-width: 0;
    flex: 0 1 auto;
  }
`;

export const CardName = styled.div`
  font-weight: 700;
  font-size: 10px;
  text-align: left;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardInlineValue = styled.div`
  min-height: 15px;
  display: inline-flex;
  align-items: baseline;
  font-weight: 400;
  font-size: 8px;
  text-transform: uppercase;
  gap: 4px;
  min-width: 0;

  & > :last-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.top {
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
`;

export const CardInfoRowValue = styled.span`
  font-size: 16px;
  display: block;
  font-weight: 400;
  line-height: 28px;
  white-space: nowrap;

  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
`;

export const InfoButton = styled.button`
  margin-top: auto;
  cursor: pointer;
  margin-right: 12px;
  align-self: flex-end;
  background: none;
  border: none;
`;

export const HiZone = styled.div`
  box-shadow: 0 0 0 2px #ff3b30;
  border-radius: 8px;
`;

export const HiZoneBorder = styled.div`
  box-shadow: inset 0 0 0 2px #ff3b30;
  border-radius: 10px;
`;

export const InfoTextButton = styled.button`
  font-size: 12px;
  color: #6f42c1;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: auto 12px 0;

  &:hover {
    background-color: rgba(111, 66, 193, 0.05);
  }
`;

export const CardTypeDescription = styled.div`
  font-size: 14px;
  line-height: 1.25;
  color: #333;
  font-weight: 400;
`;
