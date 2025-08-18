import styled, { css } from 'styled-components';

export const ListBox = styled.div`
  ${({ $maxHeight = 180 }) => css`
    max-height: ${typeof $maxHeight === 'number' ? `${$maxHeight}px` : $maxHeight};
  `}
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  ${({ $gap = 4 }) => css`
    gap: ${typeof $gap === 'number' ? `${$gap}px` : $gap};
  `}
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
`;
