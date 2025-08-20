import styled, { css } from 'styled-components';

export const Page = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CardsGrid = styled.div`
  display: grid;
  gap: 46px;
  justify-content: center;
  grid-template-columns: repeat(5, 1fr);
  padding: 20px 0;

  @media (max-width: 1700px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1350px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1124px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CardWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  cursor: ${({ $noHover }) => ($noHover ? 'default' : 'grab')};

  ${({ $dragging }) =>
    $dragging &&
    css`
      opacity: 0;
      pointer-events: none;
    `}

  ${({ $noHover }) =>
    !$noHover &&
    css`
      &:hover {
        .card-image,
        .card-info {
          filter: brightness(0.7) contrast(0.9);
          transition: filter 0.2s ease-in-out;
        }
      }
      &:hover {
        .card-drag-handle {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .card-pin-btn {
          opacity: 1;
        }
      }
    `}
`;

export const CardState = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  height: 28px;
  padding: 0 12px;
  min-width: 0;
  border-radius: 12px;
  width: fit-content;
  background-color: #eaeaed;
  color: #87879c;
`;

export const StatusIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
  background-color: ${({ $active }) => ($active ? '#1dcd27' : '#ff4d4f')};
`;

export const CardImageBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardImage = styled.img`
  width: 280px;
  height: 570px;
  object-fit: cover;
`;

export const DragHandle = styled.img.attrs({ className: 'card-drag-handle' })`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 2;
`;

export const PinBtn = styled.div.attrs({ className: 'card-pin-btn' })`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${({ $pinned }) => ($pinned ? 1 : 0)};
  transition: opacity 0.2s;
  z-index: 3;
`;

export const CardBottom = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  align-items: center;
`;

export const CardBottomText = styled.div`
  max-width: 280px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  h3 {
    font-weight: 600;
    font-size: 20px;
    line-height: 1.2;
    color: #333;
  }

  h2 {
    font-size: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1;
    font-weight: 700;
  }

  p {
    font-size: 18px;
  }
`;

export const NameEdit = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
`;

export const NameInput = styled.input`
  font-size: 18px;
  padding: 6px 10px;
  border: 2px solid #000;
  border-radius: 6px;
  text-align: center;
  width: 220px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #000;
  }
`;

export const NameSaveBtn = styled.button`
  background: #000;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }
`;

export const EditableName = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  padding: 6px 10px;
  max-width: 240px;

  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  color: #333;

  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pencil {
    opacity: 0;
    transform: translateY(1px);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  &:hover,
  &:focus-visible {
    border-color: #d5d5dd;
    background-color: #f7f7f8;
    outline: none;
  }

  &:hover .pencil,
  &:focus-visible .pencil {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    .pencil {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DraggableInfo = styled.div.attrs((p) => ({
  draggable: p.$draggable,
  className: 'card-info-draggable',
}))`
  ${({ $draggable }) =>
    !$draggable &&
    css`
      cursor: default;
    `}
`;

export const PhoneFrame = styled.div`
  position: relative;
  width: 280px;
  height: 570px;
  background: url(${(p) => p.src}) center / cover no-repeat;
`;

export const PhoneScreenImg = styled.img`
  position: absolute;
  top: 58px;
  bottom: 28px;
  left: 18px;
  right: 18px;
  margin: 0 auto;
  width: auto;
  height: calc(100% - 110px);
  object-fit: cover;
  border-radius: 12px;
`;
