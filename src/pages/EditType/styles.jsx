import styled, { css } from 'styled-components';

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepNote = styled.span`
  margin-left: auto;
  color: #6b7280;
  font-size: 14px;

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 12px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

export const TypeName = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const TypeDesc = styled.div`
  font-size: 14px;
  color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.85)' : '#6b7280')};
  text-align: center;
`;

export const TypeTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  margin-top: 6px;
  white-space: nowrap;

  ${({ $kind }) =>
    $kind === 'high'
      ? css`
          background-color: #e8fff1;
          color: #00b24f;
        `
      : css`
          background-color: #eee8ff;
          color: #6c4dd6;
        `}
`;

export const TypeCard = styled.button`
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  width: 100%;

  /* reset */
  appearance: none;
  outline: none;

  &:hover {
    border-color: #aaa;
  }

  /* иконка */
  svg {
    width: 32px;
    height: 32px;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: #c14857;
      color: #fff;
      border: none;

      svg {
        color: #fff;
      }
    `}
`;

export const CreateButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #c14857;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 24px;
  transition: background-color 0.2s ease;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const BottomText = styled.p`
  font-weight: 400;
  font-size: 11px;
  line-height: 145%;
  color: #5c5c5c;
  letter-spacing: 0px;
  text-align: center;
  vertical-align: middle;

  span {
    font-weight: bold;
  }
`;
