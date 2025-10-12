import React, { useState, useRef } from 'react';

import { Download, Upload } from 'lucide-react';

import CustomModal from '../../../customs/CustomModal';
import { GhostButton, Hint, IconWrap, Row } from '../styles';
import axiosInstance from '../../../axiosInstance';
import { useToast } from '../../../components/Toast';
import styled from 'styled-components';

const FileInput = styled.input`
  display: none;
`;

const FileUploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 16px;
  transition: all 0.2s;

  &:hover {
    border-color: #4472c4;
    background-color: #f8f9fa;
  }

  &.has-file {
    border-color: #00c853;
    background-color: #f0fff4;
  }
`;

const FileName = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const ResultsBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.$success ? '#f0fff4' : '#fff5f5'};
  border: 1px solid ${props => props.$success ? '#00c853' : '#e53935'};
`;

const ResultText = styled.div`
  font-size: 14px;
  color: ${props => props.$success ? '#00c853' : '#e53935'};
  margin-bottom: 4px;
  font-weight: 600;
`;

const ErrorList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
  font-size: 13px;
  color: #666;
  max-height: 200px;
  overflow-y: auto;
`;

const ImportClientsModal = ({ open, onClose, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  if (!open) return null;

  const handleDownloadTemplate = () => window.open('/import_customers_template.xlsx', '_blank');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Выберите файл Excel (.xlsx или .xls)');
        return;
      }
      setSelectedFile(file);
      setImportResults(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Выберите файл для импорта');
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axiosInstance.post('/clients/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImportResults(response.data);
      
      if (response.data.imported > 0) {
        toast.success(`Успешно импортировано ${response.data.imported} клиентов`);
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        toast.error('Не удалось импортировать клиентов');
      }
    } catch (error) {
      console.error('Ошибка импорта:', error);
      toast.error(error.response?.data?.detail || 'Ошибка при импорте клиентов');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResults(null);
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Импорт клиентов"
      actions={
        <>
          <CustomModal.PrimaryButton onClick={handleImport} disabled={!selectedFile || importing}>
            {importing ? 'Импортируем...' : 'Импортировать клиентов'}
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={handleClose}>Закрыть</CustomModal.SecondaryButton>
        </>
      }
    >
      <Hint>Импортируйте клиентов в систему с помощью xlsx шаблона.</Hint>

      <Row>
        <IconWrap>
          <Download size={18} />
        </IconWrap>
        <GhostButton onClick={handleDownloadTemplate}>Скачать шаблон импорта</GhostButton>
      </Row>

      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
      />

      <FileUploadArea 
        onClick={handleUploadClick}
        className={selectedFile ? 'has-file' : ''}
      >
        <IconWrap>
          <Upload size={24} />
        </IconWrap>
        <div style={{ marginTop: '8px' }}>
          {selectedFile ? 'Файл выбран' : 'Нажмите, чтобы выбрать файл Excel'}
        </div>
        {selectedFile && <FileName>📄 {selectedFile.name}</FileName>}
      </FileUploadArea>

      {importResults && (
        <ResultsBox $success={importResults.imported > 0}>
          <ResultText $success={importResults.imported > 0}>
            ✓ Импортировано: {importResults.imported} клиентов
          </ResultText>
          {importResults.errors && importResults.errors.length > 0 && (
            <>
              <div style={{ fontSize: '13px', color: '#e53935', marginTop: '8px' }}>
                ⚠️ Ошибки: {importResults.errors.length}
              </div>
              <ErrorList>
                {importResults.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ErrorList>
            </>
          )}
        </ResultsBox>
      )}
    </CustomModal>
  );
};

export default ImportClientsModal;
