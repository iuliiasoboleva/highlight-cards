import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid #d5d5dd;
  border-radius: 4px;
  background: #fff;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0;
`;

export const Title = styled.h3`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

export const Subtitle = styled.p`
  font-size: 12px;
  color: #656565;
  line-height: 1.66667;
  padding: 8px 15px 8px;
`;

export const Line = styled.hr`
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #d5d5dd;
`;

export const Button = styled.button`
  background: #1f1e1f;
  color: #fff;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  margin: 15px 15px 24px;
  min-height: 40px;

  &:hover {
    background: #111;
  }

  @media (max-width: 768px) {
    width: -webkit-fill-available;
  }
`;

export const TrashButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  padding: 4px;
  margin-right: 15px;

  &:hover {
    color: #d90000;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.p`
  font-size: 12px;
  color: #656565;
  line-height: 1.66667;
`;

export const CardPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 15px;
`;

export const CardOption = styled.div`
  padding: 8px 12px;
  border: 1px solid #d5d5dd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  span {
    font-weight: bold;
    margin-left: 4px;
    margin-top: 2px;
  }

  &:hover {
    background-color: #e9e9e9;
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border: 1px solid #d5d5dd;
  border-radius: 4px;
  padding: 10px 12px;
  margin-right: 15px;
  margin-left: 15px;
`;

export const Tag = styled.div`
  padding: 8px 12px;
  background-color: transparent;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d5d5dd;
  cursor: pointer;

  span {
    font-weight: bold;
    margin-left: 4px;
    margin-top: 2px;

    &:hover {
      color: #000;
    }
  }
`;
