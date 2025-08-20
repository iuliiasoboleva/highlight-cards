import React, { useEffect } from 'react';

import { Trash2 } from 'lucide-react';
import styled from 'styled-components';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import { AddBtn, Container, DeleteBtn, RowGrid } from './styles';

const fieldOptions = [
  { value: '2gis', label: '2GIS' },
  { value: 'yandex', label: 'Yandex' },
  { value: 'google', label: 'Google' },
];

const generateReviewLink = (type, query) => {
  const encoded = encodeURIComponent((query || '').trim());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Container data-info-key="reviewLinks">
      {formFields?.map((field, index) => (
        <RowGrid key={index}>
          {/* Платформа */}
          <CustomSelect
            value={field.type}
            onChange={(value) => handleTypeChange(index, value)}
            options={fieldOptions}
          />

          {/* Ссылка */}
          <CustomInput
            type="text"
            value={field.link}
            onChange={(e) => onFieldChange(index, 'link', e.target.value)}
            placeholder="https://"
          />

          {/* Название / Отображаемый текст */}
          <CustomInput
            type="text"
            value={field.text}
            onChange={(e) => handleTextChange(index, e.target.value)}
            placeholder="Название компании"
          />

          {/* Удалить */}
          <DeleteBtn onClick={() => onRemoveField(index)} aria-label="Удалить ссылку">
            <Trash2 size={18} />
          </DeleteBtn>
        </RowGrid>
      ))}

      <AddBtn
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
      </AddBtn>
    </Container>
  );
};

export default ReviewLinks;
