import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  margin-top: 12px;
  overflow: hidden;
  background: #fff;
`;

export const HeaderBtn = styled.button`
  background: none;
  border: none;
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const arrowDataUri =
  "url(\"data:image/svg+xml;utf8,<svg fill='%23333' width='12px' height='12px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path d='M5.516 7.548L10 12.032l4.484-4.484a1 1 0 011.414 1.414l-5.192 5.192a1 1 0 01-1.414 0L4.102 8.962a1 1 0 011.414-1.414z'/></svg>\")";

export const Icon = styled.span`
  width: 12px;
  height: 12px;
  background-image: ${arrowDataUri};
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

export const Content = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  border-top: 1px solid #dcdcdc;
  background-color: #fff;
  white-space: pre-line;
  line-height: 1.6;
`;
