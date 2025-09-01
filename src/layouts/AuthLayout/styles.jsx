import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const Left = styled.div`
  background-image: url('/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
  padding: 50px;
  color: #fff;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 40rem;
  margin: 50px auto;
  overflow-y: auto;

  /* скрыть скроллбар */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    margin-top: 0;
  }
`;

export const HighlightCard = styled.div`
  text-align: center;

  p {
    position: relative;
    font-size: 36px;
    line-height: 1.25;
    margin-bottom: 2rem;
    z-index: 5;
    text-align: center;
    max-width: 350px;
  }
`;

export const MobileHighlightCard = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;

    p {
      font-size: 24px;
      line-height: 1.3;
      color: #333;
      text-align: center;
      max-width: 280px;
    }
  }
`;

export const Logo = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 16px;
`;
