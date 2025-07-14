import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

import { getCroppedImg } from '../../utils/cropImage';

import './styles.css';

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
    <div className="editor-modal-overlay">
      <div className="editor-modal-content">
        <div className="editor-header">
          <h3>Обрезать изображение</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="editor-controls">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>＋</button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, 1))}>－</button>
          <button onClick={() => setCrop((c) => ({ ...c, x: c.x - 10 }))}>←</button>
          <button onClick={() => setCrop((c) => ({ ...c, x: c.x + 10 }))}>→</button>
          <button onClick={() => setCrop((c) => ({ ...c, y: c.y - 10 }))}>↑</button>
          <button onClick={() => setCrop((c) => ({ ...c, y: c.y + 10 }))}>↓</button>
          <button onClick={() => setFlipX((f) => !f)}>↔</button>
          <button onClick={() => setFlipY((f) => !f)}>↕</button>
          <button onClick={() => setRotation((r) => r + 90)}>⟳</button>
          <button onClick={() => setRotation((r) => r - 90)}>⟲</button>
          <button onClick={() => setAspect(1)}>1:1</button>
          <button onClick={() => setAspect(16 / 9)}>16:9</button>
          <button onClick={() => setAspect(4 / 3)}>4:3</button>
        </div>

        <div className="cropper-container">
          <div className={`crop-transform ${flipX ? 'flipped-x' : ''} ${flipY ? 'flipped-y' : ''}`}>
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

        <div className="editor-footer">
          <button onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
