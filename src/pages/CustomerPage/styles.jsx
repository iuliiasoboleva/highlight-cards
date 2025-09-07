import styled from 'styled-components';

export const Container = styled.div`
  max-width: 650px;
  margin: 50px auto 0;
  padding: 20px;
  color: #2c3e50;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    margin-left: 10px;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Header = styled.div``;

export const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 25px;
  color: #34495e;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const CustomerName = styled.span`
  font-weight: 700;
  color: #2980b9;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  button {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const SectionCard = styled.div`
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: #34495e;
`;

export const StampControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  align-items: center;

  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 14px;
  }
`;

export const InfoLabel = styled.span`
  color: #7f8c8d;
`;

export const InfoValue = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

export const Row = styled.div`
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 14px;
  }
`;

export const RowLabel = styled.span`
  color: #7f8c8d;
`;

export const RowValue = styled.span`
  font-weight: 500;
`;

export const Hint = styled.p`
  margin-top: 25px;
  font-style: italic;
  color: #95a5a6;
  text-align: center;
  font-size: 14px;
`;
