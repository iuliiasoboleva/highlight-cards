import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 120px;
  padding: 0 16px;

  @media (max-width: 480px) {
    gap: 16px;
    margin-top: 64px;
  }
`;

export const Logo = styled.img`
  width: 140px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    width: 112px;
    margin-bottom: 16px;
  }
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 28px;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const Subtitle = styled.p`
  color: #888;
  margin: 0;
  text-align: center;
  font-size: 16px;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const Note = styled.p`
  color: #888;
  text-align: center;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const Status = styled.p`
  color: #888;
  margin: 0;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;
