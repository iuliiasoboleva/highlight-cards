import React, { useCallback, useEffect, useState } from 'react';

import { Trash2 } from 'lucide-react';

import './styles.css';

const ImageUploader = ({ inputId, onSave, infoText, externalImage }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setFileName(file.name);
        onSave(imageUrl);
      }
    },
    [onSave],
  );

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
    setPreview(null);
    setFileName('');
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
        <input type="file" id={inputId} hidden accept="image/*" onChange={handleFileChange} />
        <div className="file-name-block">
          <label htmlFor={inputId} className="file-button">
            {fileName ? fileName : 'Выбрать файл'}
          </label>
          {preview && (
            <button className="clear-button" onClick={handleClear}>
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="file-info">{infoText}</div>
    </div>
  );
};

export default ImageUploader;
