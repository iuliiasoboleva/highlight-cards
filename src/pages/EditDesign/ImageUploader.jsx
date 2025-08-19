import React, { useCallback, useEffect, useState } from 'react';

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

const ImageUploader = ({ inputId, onSave, infoText, externalImage }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null); // object URL
  const [lastCropSettings, setLastCropSettings] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (externalImage) {
      setPreview(externalImage);
      if (!fileName) setFileName('uploaded-image.png');
    } else if (!externalImage && !rawImage) {
      setPreview(null);
      setFileName('');
    }
  }, [externalImage]); // eslint-disable-line react-hooks/exhaustive-deps

  // освобождаем URL при размонтировании/смене
  useEffect(() => {
    return () => {
      if (rawImage) URL.revokeObjectURL(rawImage);
    };
  }, [rawImage]);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith('image/')) {
        if (rawImage) URL.revokeObjectURL(rawImage);
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
    setLastCropSettings(null);
    onSave?.(null);

    const input = document.getElementById(inputId);
    if (input) input.value = '';
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
            type="file"
            id={inputId}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          <FileNameBlock>
            {!preview ? (
              <FileButton htmlFor={inputId}>Выбрать файл</FileButton>
            ) : (
              <FileButton type="button" onClick={handleOpenEditorAgain}>
                {fileName || 'edited-image.jpg'}
              </FileButton>
            )}

            {preview && <PreviewImg src={preview} alt="preview" />}

            {preview && (
              <ClearButton type="button" onClick={handleClear} aria-label="Очистить">
                <Trash2 size={20} />
              </ClearButton>
            )}
          </FileNameBlock>
        </DragDropBox>

        <FileInfo>{infoText}</FileInfo>
      </SimpleImageUploader>

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
