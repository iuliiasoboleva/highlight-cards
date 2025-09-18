import styled from 'styled-components';

const HERO_HEIGHT = 560;
const LAYER_HEIGHT = 420;

export const HeroContainer = styled.section`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: end;
  height: ${HERO_HEIGHT}px;
  border-radius: 0 0 24px 24px;
  overflow: hidden;

  background: radial-gradient(120% 120% at 50% 10%, #2a2a2a 0%, #161616 60%, #0d0d0d 100%);

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
    width: clamp(360px, 38vw, 520px);
    height: auto;
    object-fit: contain;
    align-self: end;
    user-select: none;
    -webkit-user-drag: none;
    cursor: pointer;
  }
`;

export const OpenedLayer = styled.div`
  height: ${LAYER_HEIGHT}px;
  width: ${(p) => (p.$w ? `${p.$w}px` : 'auto')};
  display: grid;
  align-content: end;
  justify-items: center;
  gap: 10px;

  will-change: transform, opacity;
  transition:
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;

  transform: translateY(${(p) => (p.$opened ? '0%' : '110%')});
  opacity: ${(p) => (p.$opened ? 1 : 0)};
  pointer-events: ${(p) => (p.$opened ? 'auto' : 'none')};

  .pocket {
    width: 100%;
    align-self: end;
    margin-top: -8px;
    pointer-events: none;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
  }
`;

export const Certificate = styled.div`
  width: ${(p) => (p.$w ? `${p.$w}px` : 'auto')};
  max-width: 100%;
  align-self: end;

  background: #fff;
  border-radius: 8px;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
  padding: 28px 22px 18px;

  color: #111;

  .logo {
    font:
      700 14px/1 ui-monospace,
      SFMono-Regular,
      Menlo,
      Consolas,
      monospace;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.75;
    text-align: center;
    margin-bottom: 8px;
  }

  .title {
    margin: 0;
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 32px;
    line-height: 1.15;
    font-weight: 700;
  }

  .name {
    margin-top: 8px;
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 18px;
    color: #333;
  }

  .text {
    margin: 14px auto 0;
    text-align: center;
    max-width: 85%;
    color: #343434;
    line-height: 1.4;
  }

  .amount {
    margin: 18px 0 12px;
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 36px;
    font-weight: 700;
    .rub {
      font-size: 0.6em;
      vertical-align: super;
      margin-left: 0.15em;
    }
  }

  .cta {
    width: 210px;
    height: 36px;
    border-radius: 6px;
    font-size: 14px;
    display: block;
    margin: 0 auto;
  }

  .meta {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    text-align: center;
    font-size: 12px;
    color: #6b6b6b;

    .serial {
      margin-top: 4px;
      letter-spacing: 0.35em;
      color: #9b9b9b;
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
