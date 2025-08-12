import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
`;

export const Item = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #fafafa;
  }
`;

export const ItemTitle = styled.div`
  font-weight: 500;
  color: #111;
`;

export const ItemSub = styled.div`
  font-size: 12px;
  color: #666;
`;
