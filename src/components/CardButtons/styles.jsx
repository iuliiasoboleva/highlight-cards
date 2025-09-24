import styled from 'styled-components';

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  margin-top: auto;
`;

export const ButtonsBlock = styled(ButtonsWrapper)`
  flex-direction: column;
`;

export const ActionButton = styled.button`
  background-color: #2e2e2e;
  color: white;
  border-radius: 6px;
  padding: 11px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  border: 1.6px solid transparent;
  margin: 0;
  min-width: 58px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  max-width: 268px;
  width: 100%;

  &:hover {
    color: #bf4756;
    background-color: #f9edee;
  }
`;

export const TemplateSelectButton = styled(ActionButton)`
  max-width: none;
`;

export const IconButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
  max-width: 268px;
`;

export const IconBtn = styled.button.attrs({ type: 'button' })`
  background-color: #eaeaed;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e5;
  }

  svg {
    stroke: #1f1e1f;
  }
`;
