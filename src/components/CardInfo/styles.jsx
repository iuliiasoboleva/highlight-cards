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

export const CardInfoRowValue = styled.span`
  font-size: 16px;
  display: block;
  font-weight: 400;
  line-height: 28px;
  white-space: nowrap;
`;

export const CardName = styled.div`
  font-weight: 700;
  font-size: 10px;
  text-align: left;
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

export const CardInfoQrImg = styled.img`
  max-width: 140px;
  width: 100%;
  align-self: center;
`;

export const CardInlineValue = styled.div`
  min-height: 15px;
  display: flex;
  font-weight: 400;
  font-size: 8px;
  text-transform: uppercase;
  gap: 4px;

  &.top {
    flex-direction: column;
  }
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
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  box-shadow: ${({ $hi, $hiBorder }) => {
    const shadows = [];
    if ($hi) shadows.push('0 0 0 2px #ff3b30');
    if ($hiBorder) shadows.push('inset 0 0 0 2px #ff3b30');
    return shadows.length ? shadows.join(', ') : 'none';
  }};
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

export const TopFieldsBlock = styled.div`
  display: flex;
  gap: 12px;
`;

export const CardInfoTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4px;

  &.android {
    border-bottom: 1px solid #d5d5dd;
    padding-bottom: 10px;
  }
`;

export const CardNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  margin-top: 0;
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
