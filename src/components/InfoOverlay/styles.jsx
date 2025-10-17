import styled from 'styled-components';

export const Overlay = styled.div`
  padding: 14px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 85%;
  max-width: 85%;
  width: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  line-height: 1.4;
  z-index: 5;

  /* hide scrollbar cross-browser */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none;
  } /* Chrome/Safari */
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #333;
  display: inline-flex;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ItemLabel = styled.strong`
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: #656565;
  font-weight: 600;
`;

export const Value = styled.span`
  font-size: 12px;
  line-height: 1.3333333333;
  color: #9f9fa7;
  cursor: pointer;
  white-space: normal;
  word-break: break-word;
`;

export const Multiline = styled.div`
  cursor: pointer;
`;

export const LinkLine = styled.div`
  display: flex;
  gap: 6px;
  align-items: baseline;
  overflow: hidden;
`;

export const LinkLabel = styled.span`
  font-size: 12px;
  line-height: 1.3333333333;
  color: #9f9fa7;
`;

export const LinkValue = styled.div`
  font-size: 12px;
  line-height: 1.3333333333;
  color: #9f9fa7;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
`;
