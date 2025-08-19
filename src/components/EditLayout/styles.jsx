import styled, { css } from 'styled-components';

export const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  min-height: calc(100vh - var(--header-height) - var(--bar-height));

  @media (max-width: 999px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Left = styled.div`
  width: 50%;
  padding: 20px;

  @media (max-width: 999px) {
    width: 100%;
    padding: 16px;
  }
`;

export const Right = styled.div`
  width: 50%;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  position: sticky;
  top: calc(var(--header-height) + var(--bar-height));
  align-self: flex-start;
  // height: 100vh;
  overflow-y: auto;

  @media (max-width: 999px) {
    width: 100%;
    position: static;
    height: auto;
    padding: 16px;
    border-left: none;
    border-top: none;
    background: transparent;
    margin-top: 24px;
  }
`;

export const PhoneSticky = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PhoneFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  margin-top: 30px;
  margin-bottom: 20px;
  border-radius: 45px;
  background-color: #f2f2f7;
`;

export const PhoneImage = styled.img`
  width: 100%;
  display: block;
  height: 670px;
`;

export const PhoneScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
  align-items: center;
  justify-content: center;

  @media (max-width: 999px) {
    border-bottom: none;
  }
`;

export const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  position: relative;

  ${({ $active }) =>
    $active &&
    css`
      color: #111827;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #111827;
      }
    `}
`;

export const ActivateButton = styled.button`
  background-color: #2e2e2e;
  color: white;
  border-radius: 6px;
  padding: 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  border: 1.6px solid transparent;
  margin: 0;
  min-width: 58px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  max-width: 268px;
  width: 100%;
`;

export const ActivateText = styled.p`
  margin-top: 12px;
  color: #656565;
  font-size: 12px;
  line-height: 1.6;
  max-width: 90%;
  text-align: center;
  word-break: break-word;

  @media (max-width: 999px) {
    font-size: 12px;
    text-align: center;
    color: #666;
    margin-top: 12px;
    max-width: 200px;
    margin-inline: auto;
  }
`;

export const PhoneContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`;

export const PlatformIcons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;

  @media (max-width: 999px) {
    flex-direction: row;
  }
`;

export const PlatformButton = styled.button`
  width: 48px;
  height: 48px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition:
    background-color 0.2s,
    filter 0.2s;

  ${({ $active }) =>
    $active &&
    css`
      background-color: #000;
    `}

  img {
    width: 20px;
    height: 20px;
    ${({ $active }) =>
      $active &&
      css`
        filter: invert(1);
      `}
  }
`;

export const CardState = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardTextDefault = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 133%;
  letter-spacing: -0.24px;
  max-width: 190px;
  text-align: center;
  color: #656565;
`;
