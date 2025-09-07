import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Push = styled.div`
  background-color: #25252599;
  color: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 240px;
  width: 100%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 9px;
  line-height: 1.222;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

export const Logo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  flex-shrink: 0;
  border-radius: 4px;
`;

export const Title = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.84;
  text-transform: uppercase;
`;

export const Time = styled.span`
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: 0.84;
  text-transform: uppercase;
`;

export const Message = styled.div`
  font-size: 12px;
  color: #fff;
  line-height: 1.2727272727;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;
