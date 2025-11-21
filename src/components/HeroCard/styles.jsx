import styled from 'styled-components';

const HERO_HEIGHT = 960;
const CLOSED_LAYER_HEIGHT = 800;
const OPENED_LAYER_HEIGHT = 800;

export const HeroContainer = styled.section`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: end;
  height: ${HERO_HEIGHT}px;
  min-height: 100vh;
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

  @media (max-width: 768px) {
    height: 100vh;
    min-height: 100vh;
  }
`;

export const ClosedLayer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  width: 100%;
  overflow: hidden;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '110%' : '0%')});
  opacity: ${(p) => (p.$opened ? 0 : 1)};
  pointer-events: ${(p) => (p.$opened ? 'none' : 'auto')};

  @media (min-width: 769px) {
    height: ${CLOSED_LAYER_HEIGHT}px;
    max-width: 1260px;
  }

  @media (max-width: 768px) {
    height: 800px;
    max-width: 900px;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
    cursor: pointer;

    @media (min-width: 769px) {
      max-width: 1260px;
    }

    @media (max-width: 768px) {
      max-width: 900px;
    }

    @media (max-width: 520px) {
      width: 180%;
      max-width: 2000px;
      padding: 0;
    }
  }
`;

export const OpenedLayer = styled.div`
  width: 100%;
  display: grid;
  align-content: end;
  justify-items: center;
  gap: 20px;
  position: relative;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '0%' : '110%')});
  opacity: ${(p) => (p.$opened ? 1 : 0)};
  pointer-events: ${(p) => (p.$opened ? 'auto' : 'none')};

  @media (min-width: 769px) {
    height: ${OPENED_LAYER_HEIGHT}px;
    max-width: 1260px;
  }

  @media (max-width: 768px) {
    height: 800px;
    max-width: 900px;
  }

  .pocket {
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    align-self: end;
    pointer-events: none;

    @media (min-width: 769px) {
      max-width: 1260px;
    }

    @media (max-width: 768px) {
      max-width: 900px;
    }

    @media (max-width: 520px) {
      width: 180%;
      max-width: 2000px;
    }
  }
`;

export const Certificate = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  color: #111;

  @media (min-width: 769px) {
    max-width: 1260px;
    padding: 112px 64px 148px;
    gap: 52px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 56px 32px 74px;
    gap: 26px;
  }

  .logo {
    width: auto;
    object-fit: cover;
    align-self: center;

    @media (min-width: 769px) {
      height: 96px;
    }

    @media (max-width: 768px) {
      height: 48px;
    }
  }

  .title {
    margin: 0;
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.2px;

    @media (min-width: 769px) {
      font-size: 112px;
    }

    @media (max-width: 768px) {
      font-size: clamp(40px, 6vw, 56px);
    }
  }

  .name {
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: #333;

    @media (min-width: 769px) {
      font-size: 44px;
    }

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  .text {
    text-align: center;
    color: #343434;
    line-height: 1.4;

    @media (min-width: 769px) {
      font-size: 36px;
    }

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  .amount {
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
  }
  
  .sum {
    font-weight: 700;
    font-style: italic;

    @media (min-width: 769px) {
      font-size: 96px;
    }

    @media (max-width: 768px) {
      font-size: 48px;
    }
  }
  
  .rub {
    font-weight: 500;
    margin-left: 0.15em;

    @media (min-width: 769px) {
      font-size: 44px;
    }

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  .cta {
    padding: 10px 18px;
    font-weight: 500;
    display: block;
    margin: 0 auto;

    @media (min-width: 769px) {
      width: 520px;
      height: 88px;
      font-size: 28px;
    }

    @media (max-width: 768px) {
      width: 260px;
      height: 44px;
      font-size: 14px;
    }
  }

  .meta {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    text-align: center;
    font-weight: 600;

    @media (min-width: 769px) {
      font-size: 24px;
      gap: 12px;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
    }

    .serial {
      @media (min-width: 769px) {
        margin-top: 16px;
        font-size: 20px;
      }

      @media (max-width: 768px) {
        margin-top: 8px;
        font-size: 10px;
      }
    }
  }
  
  @media (max-width: 520px) {
    max-width: 100%;
    padding: 40px 20px 100px;
    gap: 20px;
    .title {
      font-size: 40px;
    }
    .name {
      font-size: 18px;
    }
    .text {
      font-size: 16px;
    }
    .sum {
      font-size: 38px;
    }
    .rub {
      font-size: 18px;
    }
    .cta {
      width: 220px;
      height: 40px;
      font-size: 13px;
    }
    .meta {
      font-size: 11px;
      .serial {
        font-size: 9px;
      }
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
