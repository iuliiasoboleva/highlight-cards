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

export const Textarea = styled.textarea`
  width: -webkit-fill-available;
  height: 60px;
  margin: 0 15px;
  padding: 12px;
  border: 1px solid #d5d5dd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
`;

export const Input = styled.input`
  width: -webkit-fill-available;
  margin: 0 15px;
  padding: 12px;
  border: 1px solid #d5d5dd;
  border-radius: 6px;
  font-size: 14px;
`;

export const Button = styled.button`
  background: #1f1e1f;
  color: #fff;
  font-weight: 500;
  padding: 10px 18px;
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
