import styled from 'styled-components';

const HERO_HEIGHT = 660;
const LAYER_HEIGHT = 420;

export const HeroContainer = styled.section`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: end;
  height: ${HERO_HEIGHT}px;
  border-radius: 0 0 24px 24px;
  overflow: hidden;

  background:
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.012) 0 2px, rgba(0, 0, 0, 0) 2px 4px),
    radial-gradient(
      140% 170% at 50% 92%,
      rgba(255, 255, 255, 0.14) 0%,
      rgba(255, 255, 255, 0.1) 22%,
      rgba(255, 255, 255, 0.06) 44%,
      rgba(255, 255, 255, 0.03) 62%,
      rgba(255, 255, 255, 0) 78%
    ),
    linear-gradient(180deg, #1a1a1a 0%, #0b0b0b 100%);

  background-repeat: repeat, no-repeat, no-repeat;
  background-size:
    4px 4px,
    cover,
    cover;
  background-position:
    0 0,
    center bottom,
    center;

  grid-template-areas: 'stack';
  & > * {
    grid-area: stack;
  }
`;

export const ClosedLayer = styled.div`
  height: ${LAYER_HEIGHT}px;
  display: grid;
  align-content: end;
  justify-items: center;
  gap: 10px;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '110%' : '0%')});
  opacity: ${(p) => (p.$opened ? 0 : 1)};
  pointer-events: ${(p) => (p.$opened ? 'none' : 'auto')};

  img {
    width: 581px;
    height: auto;
    object-fit: contain;
    align-self: end;
    user-select: none;
    -webkit-user-drag: none;
    cursor: pointer;

     @media (max-width: 520px) {
width: 100%;
max-width: 100%;
  }
`;

export const OpenedLayer = styled.div`
  height: ${LAYER_HEIGHT}px;
  max-width: 381px;
  width: 100%;
  display: grid;
  align-content: end;
  justify-items: center;
  gap: 10px;
  position: relative;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '0%' : '110%')});
  opacity: ${(p) => (p.$opened ? 1 : 0)};
  pointer-events: ${(p) => (p.$opened ? 'auto' : 'none')};

  .pocket {
    position: absolute;
    width: 100%;
    align-self: end;
    pointer-events: none;
  }
`;

export const Certificate = styled.div`
  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  background: #fff;
  padding: 40px 20px 55px;

  color: #111;

  .logo {
    width: auto;
    height: 40px;
    object-fit: cover;
    align-self: center;
  }

  .title {
    margin: 0;
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 45px;
    line-height: 1.08;
    letter-spacing: -0.2px;
  }

  .name {
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 18px;
    color: #333;
  }

  .text {
    text-align: center;
    color: #343434;
    line-height: 1.4;
  }

  .amount {
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
  }
  .sum {
    font-size: 36px;
    font-weight: 700;
    font-style: italic;
  }
  .rub {
    font-size: 18px;
    font-weight: 500;
    margin-left: 0.15em;
  }

  .cta {
    width: 210px;
    height: 36px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    display: block;
    margin: 0 auto;
  }

  .meta {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    text-align: center;
    font-size: 10px;
    font-weight: 600;

    .serial {
      margin-top: 8px;
      font-size: 8px;
    }
  }
  @media (max-width: 520px) {
    max-width: 270px;
    .title {
      font-size: 38px;
    }
  }
`;

export const CTAButton = styled.button`
  background: #c93542;
  color: #fff;
  border: 0;
  padding: 0 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(201, 53, 66, 0.35);
  }
`;
