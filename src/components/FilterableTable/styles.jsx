import styled from 'styled-components';

export const FPContainer = styled.div`
  margin-bottom: 20px;
`;

export const FPTopButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const FPMainBtn = styled.button`
  background: ${({ $active }) => ($active ? '#5c4de5' : '#f1f1f5')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
`;

export const FPSubfilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FPTagBtn = styled.button`
  background-color: ${({ $active }) => ($active ? '#5c4de5' : '#f4f4ff')};
  color: ${({ $active }) => ($active ? '#fff' : '#5c4de5')};
  font-size: 12px;
  border-radius: 6px;
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
`;

export const FPSelected = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #f9f9f9;
  padding: 8px;
  border-radius: 8px;
  margin-top: 8px;
`;

export const FPSelectedTag = styled.div`
  background-color: #7c3aed;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const FPRemoveBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 999px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #5c4de5;
  }
`;

export const Dropdown = styled.div`
  position: relative;
  @media (max-width: 999px) {
    width: 100%;
  }
`;

export const DropdownButton = styled.button`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 160px;
  justify-content: space-between;

  @media (max-width: 999px) {
    width: 100%;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  min-width: 200px;
  padding: 6px 0;
`;

export const DropdownItem = styled.button.attrs({ type: 'button' })`
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#aaa' : '#333')};
  background: transparent;
  border: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#f6f6f6')};
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
`;

export const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
`;

export const THead = styled.thead`
  background: #fafafa;
`;

export const TH = styled.th`
  text-align: left;
  font-weight: 600;
  padding: 12px 14px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #eee;
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:nth-child(even) td {
    background: #fcfcfc;
  }

  &:hover td {
    background: ${({ $clickable }) => ($clickable ? '#f7f7ff' : 'inherit')};
  }
`;

export const TD = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  color: #2c3e50;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

export const NoDataRow = styled.td`
  text-align: center;
  padding: 18px 12px;
  color: #7f8c8d;
`;

export const DashboardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const ClientCardTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #f4f4ff;
  color: #5c4de5;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #eee;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PaginationButton = styled.button`
  background: ${({ $active }) => ($active ? '#c14857' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border: 1px solid ${({ $active }) => ($active ? '#c14857' : '#ddd')};
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  transition: all 0.2s;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#a03947' : '#f5f5f5')};
    border-color: ${({ $active }) => ($active ? '#a03947' : '#999')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

export const PaginationInfo = styled.span`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
`;

export const PaginationSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #c14857;
  }
`;
