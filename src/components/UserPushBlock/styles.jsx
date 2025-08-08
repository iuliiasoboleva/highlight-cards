import styled from 'styled-components';

export const FormWrapper = styled.div`
  border: 1px solid #d5d5dd;
  border-radius: 4px;
  padding: 15px;
  background-color: white;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
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
  margin: 4px 0;
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

export const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const BlackButton = styled.button`
  background: #1f1e1f;
  color: #fff;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  min-height: 40px;

  &:hover {
    background: #111;
  }

  @media (max-width: 768px) {
    width: -webkit-fill-available;
  }
`;

export const WhiteButton = styled.button`
  background: transparent;
  color: #1f1e1f;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 4px;
  border: 1px solid #d5d5dd;
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  min-height: 40px;

  &:hover {
    background: gray;
    color: white;
  }

  @media (max-width: 768px) {
    width: -webkit-fill-available;
  }
`;
