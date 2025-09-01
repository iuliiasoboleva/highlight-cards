import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 20px 20px 0 20px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: linear-gradient(244.55deg, #d4d4e44d, #ffffff4d 66.12%), #fff;
  border: 0.1rem solid #d5d5dd;
  border-radius: 4px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
  gap: 12px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Icon = styled.img`
  height: 24px;
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

export const Text = styled.p`
  font-size: 14px;
  color: #656565;
  line-height: 1.4;
  max-width: 400px;
  margin: 0;
`;

export const Instruction = styled.p`
  font-size: 13px;
  margin-top: 8px;

  a {
    text-decoration: underline;
    color: #374151;
    word-break: break-all;
  }
`;
