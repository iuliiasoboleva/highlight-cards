import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 95vw;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

export const ControlBtn = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const CropperContainer = styled.div`
  position: relative;
  width: 500px;
  height: 400px;
  background: #f0f0f0;
  align-self: center;

  @media (max-width: 560px) {
    width: 90vw;
    height: 60vw;
  }
`;

export const TransformWrap = styled.div`
  width: 100%;
  height: 100%;
  transform: ${({ $flipX, $flipY }) => {
    if ($flipX && $flipY) return 'scaleX(-1) scaleY(-1)';
    if ($flipX) return 'scaleX(-1)';
    if ($flipY) return 'scaleY(-1)';
    return 'none';
  }};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const PrimaryBtn = styled.button`
  margin-top: 8px;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
`;
