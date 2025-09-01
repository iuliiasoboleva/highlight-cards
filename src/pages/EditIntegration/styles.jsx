import styled, { css } from 'styled-components';

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;
  }
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 16px 0 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    transform 0.02s ease;

  aspect-ratio: 299 / 186;

  &:hover {
    border-color: #cfd4dc;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(191, 71, 86, 0.25);
  }

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: #bf4756;
      box-shadow: 0 0 0 2px rgba(191, 71, 86, 0.25) inset;
    `}
`;

export const LogoBox = styled.div`
  flex: 1 1 auto;
  border-radius: 8px;
  display: grid;
  place-items: center;

  img {
    max-width: 80%;
    max-height: 70%;
    object-fit: contain;
  }
  span {
    font-size: 24px;
    font-weight: 600;
    color: #374151;
  }
`;

export const Name = styled.div`
  margin-top: 10px;
  text-align: center;
  color: #bababa;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
`;

export const RadioHidden = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;
