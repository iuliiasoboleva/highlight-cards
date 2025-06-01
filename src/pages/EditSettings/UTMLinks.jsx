import React, { useState } from 'react';

import { Copy, Download, Trash2 } from 'lucide-react';

import './styles.css';

const UTMLinks = ({ utmLinks, onAddLink, onRemoveLink }) => {
  const [newSource, setNewSource] = useState('');

  const handleAdd = () => {
    if (newSource.trim()) {
      onAddLink(newSource.trim());
      setNewSource('');
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована!');
  };

  const handleDownloadQR = (url) => {
    alert(`Скачиваем QR для ${url} (здесь должна быть логика генерации/скачивания)`);
  };

  return (
    <div className="utm-container">
      {utmLinks?.length > 0 && (
        <div className="utm-header">
          <span>Название источника</span>
          <span>UTM-ссылка</span>
          <span>Скачать QR</span>
        </div>
      )}

      {utmLinks?.map((item, index) => (
        <div key={index} className="utm-row">
          <span>{item.source}</span>
          <span className="utm-link">
            <span onClick={() => handleCopy(item.url)} className="utm-copy">
              <Copy size={16} />
            </span>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          </span>
          <button className="card-form-delete-btn" onClick={() => handleDownloadQR(item.url)}>
            <Download size={16} />
          </button>
          <button className="card-form-delete-btn" onClick={() => onRemoveLink(index)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <input
        className="custom-input"
        type="text"
        value={newSource}
        onChange={(e) => setNewSource(e.target.value)}
        placeholder="Название источника"
      />

      <button className="card-form-add-btn" onClick={handleAdd} disabled={!newSource.trim()}>
        Добавить ссылку с UTM-меткой
      </button>
    </div>
  );
};

export default UTMLinks;
