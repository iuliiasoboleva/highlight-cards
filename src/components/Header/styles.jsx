import styled from 'styled-components';

export const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  padding: 10px 20px 10px calc(var(--sidebar-width) + 20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;

  @media (max-width: 999px) {
    position: static;
    padding: 10px 16px;
  }
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 999px) {
    gap: 6px;
  }
`;

export const Logo = styled.img`
  height: 62px;
  width: auto;
  object-fit: cover;
  cursor: pointer;

  @media (max-width: 999px) {
    height: 40px;
  }
`;

export const LogoBlock = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const HeaderIcons = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  position: relative;
`;

export const UserSection = styled.div`
  background-color: #f9edee;
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 2px;
  align-items: center;
  color: #c14857;
  font-size: 13px;
  cursor: pointer;

  @media (max-width: 999px) {
    background-color: transparent;
    padding: 0;
  }
`;

export const HelpBlock = styled.div`
  background-color: #fafafa;
  display: flex;
  gap: 12px;
  border: 1px solid #f9f9f9;
  padding: 8px 12px;
  border-radius: 2px;
  align-items: center;
  color: #000;
  font-size: 13px;
  cursor: pointer;

  p {
    margin: 0;
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const LogoutBlock = styled.div`
  margin-left: 12px;
  cursor: pointer;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const UserName = styled.span`
  margin-left: 5px;
  font-weight: 600;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const AvatarCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  color: #c14857;
  font-weight: 600;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 999px) {
    width: 40px;
    height: 40px;
    background: #c14857;
    color: #fff;
    font-size: 15px;
    box-shadow: none;
  }
`;

export const DemoBadge = styled.p`
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;

  span {
    color: #c14857;
    font-size: 14px;
    font-weight: 400;
  }

  @media (max-width: 1000px) {
    font-size: 13px;
    font-weight: 400;

    span {
      font-size: 10px;
    }
  }
`;

export const MobileOnly = styled.div`
  @media (min-width: 1000px) {
    display: none;
  }
`;

export const MobileSheet = styled.div`
  position: fixed;
  inset: 0;
  padding: 24px;
  z-index: 1101;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const MobileMenu = styled.div`
  margin-top: 30px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
`;

export const MobileItem = styled.button`
  width: 100%;
  appearance: none;
  border: none;
  background: #f8f8f8;
  padding: 12px 14px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }

  &:active {
    background: #f8f8f8;
  }
`;
