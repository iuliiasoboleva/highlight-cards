import React, { useEffect } from 'react';

import { Trash2 } from 'lucide-react';

import CustomSelect from '../../customs/CustomSelect';

import './styles.css';

const fieldOptions = [
  { value: '2gis', label: '2GIS' },
  { value: 'yandex', label: 'Yandex' },
  { value: 'google', label: 'Google' },
];

const generateReviewLink = (type, query) => {
  const encoded = encodeURIComponent(query.trim());
  switch (type) {
    case '2gis':
      return `https://2gis.ru/search/${encoded}`;
    case 'yandex':
      return `https://yandex.ru/maps/?text=${encoded}`;
    case 'google':
      return `https://www.google.com/search?q=${encoded}+отзывы`;
    default:
      return '';
  }
};

const ReviewLinks = ({ formFields, onFieldChange, onAddField, onRemoveField }) => {
  useEffect(() => {
    if (!formFields?.length) {
      onAddField({
        type: '2gis',
        link: '',
        text: '',
      });
    }
  }, []);

  const handleTypeChange = (index, newType) => {
    const currentText = formFields[index]?.text || '';
    const newLink = generateReviewLink(newType, currentText);
    onFieldChange(index, 'type', newType);
    onFieldChange(index, 'link', newLink);
  };

  const handleTextChange = (index, value) => {
    onFieldChange(index, 'text', value);
    const platform = formFields[index]?.type || 'yandex';
    const newLink = generateReviewLink(platform, value);
    onFieldChange(index, 'link', newLink);
  };

  return (
    <div className="card-form-container" data-info-key="reviewLinks">
      {formFields?.map((field, index) => (
        <div key={index} className="card-info-form-row">
          {/* Платформа */}
          <CustomSelect
            value={field.type}
            onChange={(value) => handleTypeChange(index, value)}
            options={fieldOptions}
          />

          {/* Ссылка */}
          <input
            type="text"
            className="custom-input"
            value={field.link}
            onChange={(e) => onFieldChange(index, 'link', e.target.value)}
            placeholder="https://"
          />

          {/* Название / Отображаемый текст */}
          <input
            type="text"
            className="custom-input"
            value={field.text}
            onChange={(e) => handleTextChange(index, e.target.value)}
            placeholder="Название компании"
          />

          {/* Удалить */}
          <button
            className="card-form-delete-btn"
            onClick={() => onRemoveField(index)}
            aria-label="Удалить ссылку"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button
        className="card-form-add-btn"
        onClick={() =>
          onAddField({
            type: 'yandex',
            link: '',
            text: '',
          })
        }
        disabled={formFields?.length >= 6}
      >
        Добавить ссылку
      </button>
    </div>
  );
};

export default ReviewLinks;
