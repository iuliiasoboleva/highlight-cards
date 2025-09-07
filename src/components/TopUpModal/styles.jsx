import styled from 'styled-components';

export const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const PresetBtn = styled.button`
  padding: 10px;
  border: 1px solid ${({ $active }) => ($active ? '#9F8DF1' : '#ddd')};
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#f5f2ff' : '#f7f7f7')};
  font-weight: 600;
  font-size: 14px;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.05s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#efe9ff' : '#ececec')};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 16px;

  @media (max-width: 420px) {
    flex-direction: column;
    gap: 8px;
  }
`;
