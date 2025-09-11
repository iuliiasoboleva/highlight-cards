import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Trash2 } from 'lucide-react';

import ImageEditorModal from '../../components/ImageEditorModal';
import {
  ClearButton,
  DragDropBox,
  DragIcon,
  FileButton,
  FileInfo,
  FileNameBlock,
  PreviewImg,
  SimpleImageUploader,
} from './styles';

const ImageUploader = ({ inputId, onSave, infoText, externalImage, aspect }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [lastCropSettings, setLastCropSettings] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  const SUPPORTED_MIME = ['image/png', 'image/jpeg'];
  const isSupportedFile = (file) => {
    if (!file) return false;
    if (SUPPORTED_MIME.includes(file.type)) return true;
    const name = (file.name || '').toLowerCase();
    return name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg');
  };

  useEffect(() => {
    if (externalImage) {
      setPreview(externalImage);
      if (!fileName) setFileName('uploaded-image.png');
    } else if (!externalImage && !rawImage) {
      setPreview(null);
      setFileName('');
    }
  }, [externalImage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (rawImage) URL.revokeObjectURL(rawImage);
    };
  }, [rawImage]);

  const handleFile = useCallback(
    (file) => {
      setError('');
      if (file && isSupportedFile(file)) {
        if (rawImage) URL.revokeObjectURL(rawImage);
        const imageUrl = URL.createObjectURL(file);
        setRawImage(imageUrl);
        setEditorOpen(true);
        setInputKey(Date.now());
        setFileName(file.name || 'edited-image.jpg');
      } else if (file) {
        setError('Недоступный формат для загрузки, выберите файл PNG или JPEG');
      }
    },
    [rawImage],
  );

  const handleEditorSave = (croppedImageUrl) => {
    setPreview(croppedImageUrl);
    if (!fileName) setFileName('edited-image.jpg');
    onSave?.(croppedImageUrl);
  };

  const handleOpenEditorAgain = () => {
    if (rawImage) setEditorOpen(true);
  };

  const handleEditorStateChange = (settings) => {
    setLastCropSettings(settings);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleClear = () => {
    if (rawImage) URL.revokeObjectURL(rawImage);
    setPreview(null);
    setFileName('');
    setRawImage(null);
    setError('');
    setLastCropSettings(null);
    onSave?.(null);

    const input = inputRef.current || document.getElementById(inputId);
    if (input) input.value = '';
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <SimpleImageUploader>
        <DragDropBox
          $dragOver={isDragOver}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <DragIcon>
            <img src="/drag-and-drop.png" alt="Drag&Drop" />
          </DragIcon>

          <input
            key={inputKey}
            ref={inputRef}
            type="file"
            id={inputId}
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <FileNameBlock>
            <FileButton
              type="button"
              onClick={preview ? handleOpenEditorAgain : openFileDialog}
              $uploaded={!!preview}
            >
              {preview ? 'Загружено' : 'Выбрать файл'}
            </FileButton>

            {preview && <PreviewImg src={preview} alt="preview" />}

            {preview && (
              <ClearButton type="button" onClick={handleClear} aria-label="Очистить">
                <Trash2 size={20} />
              </ClearButton>
            )}
          </FileNameBlock>
        </DragDropBox>

        <FileInfo>
          {infoText}
          {error && <div style={{ color: '#ff3b30', marginTop: 6, fontSize: 12 }}>{error}</div>}
        </FileInfo>
      </SimpleImageUploader>

      <ImageEditorModal
        open={editorOpen}
        image={rawImage}
        onClose={() => setEditorOpen(false)}
        onSave={handleEditorSave}
        initialState={{ ...(lastCropSettings || {}), ...(aspect ? { aspect } : {}) }}
        onStateChange={handleEditorStateChange}
      />
    </>
  );
};

export default ImageUploader;
