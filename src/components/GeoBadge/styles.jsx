import styled from 'styled-components';

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  background-color: #057cfd;
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  position: relative;
  font-variant-numeric: tabular-nums;

  &::after {
    content: '';
    position: absolute;
    left: 6px;
    bottom: -4px;
    width: 8px;
    height: 8px;
    background-color: #057cfd;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
`;
