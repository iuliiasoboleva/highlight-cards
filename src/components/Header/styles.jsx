import styled from 'styled-components';

export const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgb(239, 227, 229);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 999px) {
    flex-direction: column;
    gap: 6px;
  }
`;

export const Logo = styled.img`
  height: 40px;
  width: auto;
  object-fit: cover;
  cursor: pointer;
`;

export const HeaderIcons = styled.div`
  align-items: center;
  display: flex;
  gap: 24px;
  position: relative; /* для выпадалки */
`;

export const IconButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 0; /* плотнее область клика, без артефактов */
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 8px;
`;

export const UserName = styled.span`
  margin-left: 5px;
  font-weight: 600;
`;

export const DemoBadge = styled.span`
  background: #bf4756;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ProfileEmail = styled.div`
  color: #656565;
  font-size: 14px;
`;

export const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #bf4756;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
