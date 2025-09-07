import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Thead = styled.thead``;

export const Trow = styled.tr`
  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover td {
        background-color: #f5f5f5;
      }
    `}
`;

const baseCell = css`
  padding: 12px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  font-weight: 400;
  vertical-align: middle;

  &:last-child {
    border-right: none;
  }

  ${({ $align }) =>
    $align === 'left' &&
    css`
      text-align: left;
    `}
  ${({ $align }) =>
    $align === 'center' &&
    css`
      text-align: center;
    `}
  ${({ $align }) =>
    $align === 'right' &&
    css`
      text-align: right;
    `}
`;

export const Th = styled.th`
  ${baseCell};
  background-color: #f9edee;
  text-transform: uppercase;
  color: #000;
`;

export const Td = styled.td`
  ${baseCell};

  ${({ $featureCell }) =>
    $featureCell &&
    css`
      font-weight: 500;
      min-width: 200px;
    `}
`;

export const NoDataTd = styled.td`
  text-align: center;
  padding: 24px;
  color: #999;
  border-bottom: 1px solid #eee;
`;

export const DashboardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const statusColors = {
  planned: { bg: 'rgba(255, 193, 7, 0.1)', fg: '#ffc107' },
  sent: { bg: 'rgba(40, 167, 69, 0.1)', fg: '#28a745' },
  draft: { bg: 'rgba(108, 117, 125, 0.1)', fg: '#6c757d' },
  error: { bg: 'rgba(220, 53, 69, 0.1)', fg: '#dc3545' },
  success: { bg: '#e6f7ee', fg: '#00a651' },
};

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;

  ${({ $variant }) => {
    const v = statusColors[$variant] || statusColors.draft;
    return css`
      background-color: ${v.bg};
      color: ${v.fg};
    `;
  }}
`;
