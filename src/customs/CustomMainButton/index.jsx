import styled from 'styled-components';

const CustomMainButton = styled.button`
  background-color: #2e2e2e;
  color: #fff;
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

  max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '268px')};
  width: 100%;
  margin-top: ${({ $mt }) => ($mt !== undefined ? `${$mt}px` : 'auto')};
  gap: 4px;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    color: #bf4756;
    background-color: #f9edee;
  }

  &:disabled {
    background-color: #e5e5e5;
    color: #9b9b9b;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export default CustomMainButton;
