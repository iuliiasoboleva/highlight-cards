import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import { getCroppedImg } from '../../utils/cropImage';

import './styles.css';

const ImageEditorModal = ({ open, image, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [aspect, setAspect] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    const width = 320;
    const height = aspect ? Math.round(width / aspect) : croppedAreaPixels.height;

    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels,
      rotation,
      { flip: { horizontal: flipX, vertical: flipY } },
      { width, height },
    );

    onSave(croppedImage);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal-content">
        <h3>Обрезать изображение</h3>

        <div className="cropper-container">
          <div
            className="crop-transform"
            style={{
              transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
            }}
          >
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
          </div>
        </div>

        <div className="controls">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>+</button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, 1))}>−</button>
          <button onClick={() => setRotation((r) => r + 90)}>⟳</button>
          <button onClick={() => setRotation((r) => r - 90)}>⟲</button>
          <button onClick={() => setFlipX((f) => !f)}>↔</button>
          <button onClick={() => setFlipY((f) => !f)}>↕</button>
          <button onClick={() => setAspect(1)}>1:1</button>
          <button onClick={() => setAspect(16 / 9)}>16:9</button>
          <button onClick={() => setAspect(4 / 3)}>4:3</button>
        </div>

        <div className="footer">
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
