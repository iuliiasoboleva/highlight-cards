import React, { useCallback, useEffect, useState } from 'react';

import { Trash2 } from 'lucide-react';

import ImageEditorModal from '../../components/ImageEditorModal';

import './styles.css';

const ImageUploader = ({ inputId, onSave, infoText, externalImage }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [lastCropSettings, setLastCropSettings] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith('image/')) {
        if (rawImage) {
          URL.revokeObjectURL(rawImage);
        }
        const imageUrl = URL.createObjectURL(file);
        setRawImage(imageUrl);
        setEditorOpen(true);
        setInputKey(Date.now());
      }
    },
    [rawImage],
  );

  const handleEditorSave = (croppedImageUrl) => {
    setPreview(croppedImageUrl);
    setFileName('edited-image.jpg');
    onSave(croppedImageUrl);
  };

  const handleOpenEditorAgain = () => {
    if (rawImage) {
      setEditorOpen(true);
    }
  };

  const handleEditorStateChange = (settings) => {
    setLastCropSettings(settings);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClear = () => {
    if (rawImage) {
      URL.revokeObjectURL(rawImage);
    }
    setPreview(null);
    setFileName('');
    setRawImage(null);
    setLastCropSettings(null);
    onSave(null);
    const input = document.getElementById(inputId);
    if (input) input.value = '';
  };

  // 👉 следим за внешним сбросом (например, из редакса)
  useEffect(() => {
    if (!externalImage) {
      setPreview(null);
      setFileName('');
    }
  }, [externalImage]);

  return (
    <>
      <div className="simple-image-uploader">
        <div
          className={`drag-drop-box ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="drag-icon">
            <img src={'/drag-and-drop.png'} alt={'Drag&Drop'} />
          </div>
          <input
            key={inputKey}
            type="file"
            id={inputId}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="file-name-block">
            {!preview ? (
              <label htmlFor={inputId} className="file-button">
                Выбрать файл
              </label>
            ) : (
              <button className="file-button" onClick={handleOpenEditorAgain}>
                {fileName}
              </button>
            )}
            {preview && (
              <button className="clear-button" onClick={handleClear}>
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="file-info">{infoText}</div>
      </div>
      <ImageEditorModal
        open={editorOpen}
        image={rawImage}
        onClose={() => setEditorOpen(false)}
        onSave={handleEditorSave}
        initialState={lastCropSettings || {}}
        onStateChange={handleEditorStateChange}
      />
    </>
  );
};

export default ImageUploader;
