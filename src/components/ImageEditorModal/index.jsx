import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

import { getCroppedImg } from '../../utils/cropImage';
import {
  CloseButton,
  ControlBtn,
  Controls,
  CropperContainer,
  Footer,
  Header,
  Modal,
  Overlay,
  PrimaryBtn,
  TransformWrap,
} from './styles';

const ImageEditorModal = ({
  open,
  image,
  onClose,
  onSave,
  initialState = {},
  onStateChange = () => {},
}) => {
  const [crop, setCrop] = useState(initialState.crop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialState.zoom || 1);
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [flipX, setFlipX] = useState(initialState.flipX || false);
  const [flipY, setFlipY] = useState(initialState.flipY || false);
  const [aspect, setAspect] = useState(initialState.aspect || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (open && image) {
      setCrop(initialState?.crop || { x: 0, y: 0 });
      setZoom(initialState?.zoom || 1);
      setRotation(initialState?.rotation || 0);
      setFlipX(initialState?.flipX || false);
      setFlipY(initialState?.flipY || false);
      setAspect(initialState?.aspect || 1);
      setCroppedAreaPixels(null);
    }
  }, [open, image]);

  useEffect(() => {
    onStateChange({ crop, zoom, rotation, flipX, flipY, aspect });
  }, [crop, zoom, rotation, flipX, flipY, aspect]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    const width = 320;
    const height = aspect ? Math.round(width / aspect) : 320;

    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels,
      rotation,
      { horizontal: flipX, vertical: flipY },
      { width, height },
    );

    onSave(croppedImage);
    onClose();
  };

  if (!open) return null;

  return (
    <Overlay>
      <Modal>
        <Header>
          <h3>Обрезать изображение</h3>
          <CloseButton onClick={onClose} aria-label="Закрыть">
            ×
          </CloseButton>
        </Header>

        <Controls>
          <ControlBtn onClick={() => setZoom((z) => Math.min(z + 0.1, 3))} title="Приблизить">
            ＋
          </ControlBtn>
          <ControlBtn onClick={() => setZoom((z) => Math.max(z - 0.1, 1))} title="Отдалить">
            －
          </ControlBtn>
          <ControlBtn onClick={() => setCrop((c) => ({ ...c, x: c.x - 10 }))} title="Сдвиг влево">
            ←
          </ControlBtn>
          <ControlBtn onClick={() => setCrop((c) => ({ ...c, x: c.x + 10 }))} title="Сдвиг вправо">
            →
          </ControlBtn>
          <ControlBtn onClick={() => setCrop((c) => ({ ...c, y: c.y - 10 }))} title="Сдвиг вверх">
            ↑
          </ControlBtn>
          <ControlBtn onClick={() => setCrop((c) => ({ ...c, y: c.y + 10 }))} title="Сдвиг вниз">
            ↓
          </ControlBtn>
          <ControlBtn onClick={() => setFlipX((f) => !f)} title="Отразить по X">
            ↔
          </ControlBtn>
          <ControlBtn onClick={() => setFlipY((f) => !f)} title="Отразить по Y">
            ↕
          </ControlBtn>
          <ControlBtn onClick={() => setRotation((r) => r + 90)} title="Повернуть по часовой">
            ⟳
          </ControlBtn>
          <ControlBtn onClick={() => setRotation((r) => r - 90)} title="Повернуть против часовой">
            ⟲
          </ControlBtn>
          <ControlBtn onClick={() => setAspect(1)} title="Соотношение 1:1">
            1:1
          </ControlBtn>
          <ControlBtn onClick={() => setAspect(16 / 9)} title="Соотношение 16:9">
            16:9
          </ControlBtn>
          <ControlBtn onClick={() => setAspect(4 / 3)} title="Соотношение 4:3">
            4:3
          </ControlBtn>
        </Controls>

        <CropperContainer>
          <TransformWrap $flipX={flipX} $flipY={flipY}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </TransformWrap>
        </CropperContainer>

        <Footer>
          <PrimaryBtn onClick={handleSave}>Сохранить</PrimaryBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default ImageEditorModal;
