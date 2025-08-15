import styled from 'styled-components';

export const PageWrap = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #fff;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 980px;
  max-height: 590px;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const LeftCol = styled.div`
  display: flex;
  justify-content: center;
`;

export const Image = styled.img`
  width: 100%;
  max-width: 360px;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;

  @media (max-width: 900px) {
    max-width: 280px;
    margin: 0 auto;
  }
`;

export const RightCol = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
  flex-direction: column;
  max-width: 410px;

  @media (max-width: 900px) {
    justify-items: center;
    text-align: center;
    align-items: center;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: #c31e3c;
  font-weight: 500;
  font-style: italic;
  font-size: clamp(28px, 5vw, 56px);
  line-height: 1.1;
`;

export const Message = styled.p`
  margin: 0 0 8px 0;
  color: #111;
  font-size: 24px;
  line-height: 1.6;

  @media (max-width: 900px) {
    font-size: 16px;
  }
`;

export const PrimaryLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c31e3c;
  color: #fff;
  max-width: 203px;
  width: 100%;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 17px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.02s ease,
    background 0.15s ease;
  margin-top: 40px;

  &:hover {
    background: #a91b32;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid #222;
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    margin-top: 0;
  }
`;
