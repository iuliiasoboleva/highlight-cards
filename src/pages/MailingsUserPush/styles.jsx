import styled from 'styled-components';

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

  @media (min-width: 1000px) {
    padding-left: 20px;
  }
`;

export const Left = styled.div`
  width: 50%;
  padding: 20px 20px 20px 40px;

  @media (min-width: 1000px) {
    flex: 0 0 calc(50% - 10px) !important; /* учёт gap:20px */
    max-width: calc(50% - 10px) !important;
    padding-left: 0 !important;
    padding-top: 20px;
  }

  @media (max-width: 999px) {
    width: 100%;
    padding: 16px;
    position: static;
    height: auto;
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
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 999px) {
    position: static;
    width: 100%;
    padding: 16px;
    background: transparent;
    border-left: none;
    margin-top: 24px;
    height: auto;
  }

  @media (min-width: 1000px) {
    flex: 0 0 calc(50% - 10px) !important; /* учёт gap:20px */
    max-width: calc(50% - 10px) !important;
  }
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

export const Line = styled.hr`
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #d5d5dd;
  margin-bottom: 24px;
`;

export const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${({ active }) => (active ? '#111827' : '#6b7280')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #111827;
    opacity: ${({ active }) => (active ? 1 : 0)};
    transition: opacity 0.3s;
  }
`;

export const Subtitle = styled.p`
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
`;

export const Button = styled.button`
  padding: 14px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &.disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const PhoneSticky = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardState = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  height: 28px;
  padding: 0 12px;
  min-width: 0;
  border-radius: 12px;
  width: fit-content;
  background-color: #eaeaed;
  color: #87879c;

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    background-color: #ccc;

    &.active {
      background-color: #1dcd27;
    }

    &.inactive {
      background-color: #ff4d4f;
    }
  }
`;

export const PhoneFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 280px;
  margin: 30px 0 20px;
  border-radius: 45px;
  background-color: #f2f2f7;
`;

export const PhoneImage = styled.img`
  width: 100%;
  height: 570px;
  display: block;
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

export const FormWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 12px;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

export const FormDescription = styled.p`
  font-size: 14px;
  color: #555;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 14px;
`;

export const TagWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

export const Tag = styled.span`
  background: #f2f2f2;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  display: inline-block;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

export const BlackButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #111;
  }
`;

export const WhiteButton = styled.button`
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`;
