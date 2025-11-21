import styled, { css } from 'styled-components';

const HERO_HEIGHT = 960;
const CLOSED_LAYER_HEIGHT = 800;
const OPENED_LAYER_HEIGHT = 800;
const DESKTOP_MAX_WIDTH = 1260;
const TABLET_MAX_WIDTH = 900;
const MOBILE_EXTRA_WIDTH = '180%';
const MOBILE_MAX_WIDTH = 2000;
const OPENED_DESKTOP_HEIGHT = 940;
const DESKTOP_PADDING_LEFT_PERCENT = (378 / 1594) * 100;
const DESKTOP_PADDING_RIGHT_PERCENT = (352 / 1594) * 100;

const sharedLayerWidth = css`
  width: 100%;
  max-width: ${DESKTOP_MAX_WIDTH}px;
  justify-self: center;

  @media (max-width: 768px) {
    max-width: ${TABLET_MAX_WIDTH}px;
  }
`;

const sharedArtworkWidth = css`
  width: 100%;
  max-width: ${DESKTOP_MAX_WIDTH}px;

  @media (max-width: 768px) {
    max-width: ${TABLET_MAX_WIDTH}px;
  }

  @media (max-width: 520px) {
    width: ${MOBILE_EXTRA_WIDTH};
    max-width: ${MOBILE_MAX_WIDTH}px;
  }
`;

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
  ${sharedLayerWidth};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
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
  }

  @media (max-width: 768px) {
    height: 800px;
  }

  img {
    ${sharedArtworkWidth};
    height: auto;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
    cursor: pointer;

    @media (max-width: 520px) {
      padding: 0;
    }
  }
`;

export const OpenedLayer = styled.div`
  ${sharedLayerWidth};
  display: grid;
  align-content: flex-start;
  justify-items: center;
  gap: 24px;
  position: relative;
  box-sizing: border-box;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '0%' : '110%')});
  opacity: ${(p) => (p.$opened ? 1 : 0)};
  pointer-events: ${(p) => (p.$opened ? 'auto' : 'none')};

  @media (min-width: 769px) {
    height: ${OPENED_DESKTOP_HEIGHT}px;
  }

  @media (min-width: 1025px) {
    padding: 60px ${DESKTOP_PADDING_RIGHT_PERCENT}% 140px ${DESKTOP_PADDING_LEFT_PERCENT}%;
  }

  @media (max-width: 768px) {
    height: 800px;
  }

  .pocket {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    align-self: end;
    pointer-events: none;
    ${sharedArtworkWidth};

    @media (min-width: 1025px) {
      width: calc(100% - ${DESKTOP_PADDING_LEFT_PERCENT + DESKTOP_PADDING_RIGHT_PERCENT}%);
    }
  }
`;

export const Certificate = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 26px;

  background: #fff;
  padding: 56px 32px 74px;
  box-sizing: border-box;

  color: #111;
  transition: transform 0.3s ease;

  @media (min-width: 769px) {
    transform: translate(-10px, 10px);
  }

  .logo {
    width: auto;
    height: 48px;
    object-fit: cover;
    align-self: center;
  }

  .title {
    margin: 0;
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: clamp(40px, 6vw, 56px);
    line-height: 1.08;
    letter-spacing: -0.2px;
  }

  .name {
    text-align: center;
    font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 22px;
    color: #333;
  }

  .text {
    text-align: center;
    color: #343434;
    line-height: 1.4;
    font-size: 18px;
  }

  .amount {
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
  }
  .sum {
    font-size: 48px;
    font-weight: 700;
    font-style: italic;
  }
  .rub {
    font-size: 22px;
    font-weight: 500;
    margin-left: 0.15em;
  }

  .cta {
    width: 260px;
    height: 44px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    display: block;
    margin: 0 auto;
  }

  .meta {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;

    .serial {
      margin-top: 8px;
      font-size: 10px;
    }
  }
  @media (max-width: 768px) {
    max-width: ${TABLET_MAX_WIDTH}px;
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
