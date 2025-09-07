import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;

  background-color: #fff;
  border-radius: 0.4rem;
  border: 0.1rem solid #d5d5dd;
  padding: 1.5rem;
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatValue = styled.div`
  font-size: 40px;
  color: #000;
  line-height: 1.3;
  font-weight: 300;
  display: flex;
  gap: 2px;
  align-items: center;
  width: 100%;
`;

export const StatIcon = styled.div`
  background: #fff2e1;
  line-height: 24px;
  color: #d48b00;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatFooter = styled.div`
  color: #d48b00;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.024rem;
  line-height: 1.25;
  margin-right: 10px;
`;

export const StatBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const StatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  line-height: 1.6666666667;
  color: #656565;
  letter-spacing: -0.024rem;
`;

export const Stars = styled.div`
  font-size: 24px;
  color: #ccc;
  margin-bottom: 8px;
`;

export const TooltipIcon = styled.span`
  display: inline-block;
  margin-left: 6px;
  background-color: #f0f0f0;
  color: #555;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: bold;
  cursor: help;
  position: relative;

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 1;
  }

  &:hover::after {
    opacity: 1;
  }
`;
