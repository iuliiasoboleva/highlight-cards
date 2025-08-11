import React, { useEffect } from 'react';

import { Trash2 } from 'lucide-react';

import CustomSelect from '../../customs/CustomSelect';

import './styles.css';

const fieldOptions = [
  { value: 'url', label: 'URL' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Адрес' },
];

const knownAddresses = [
  'Москва, ул. Арбат, 10',
  'Санкт-Петербург, Невский проспект',
  'Казань, Кремлёвская улица',
  'Новосибирск, Красный проспект',
  'Екатеринбург, Вайнера, 9',
];

const ActiveLinks = ({ formFields, onFieldChange, onAddField, onRemoveField }) => {
  useEffect(() => {
    if (!formFields?.length) {
      onAddField({
        type: 'url',
        link: 'https://',
        text: '',
      });
    }
  }, []);

  const handleTypeChange = (index, value) => {
    let defaultLink = '';
    if (value === 'url') defaultLink = 'https://';
    if (value === 'phone') defaultLink = 'tel:';
    if (value === 'email') defaultLink = 'mailto:';

    onFieldChange(index, 'type', value);
    onFieldChange(index, 'link', defaultLink);
    onFieldChange(index, 'text', '');
  };

  const handleAddressChange = (index, value) => {
    onFieldChange(index, 'text', value);

    const match = knownAddresses.find((addr) => addr.toLowerCase() === value.toLowerCase());

    if (match) {
      const link = `https://yandex.ru/maps/?text=${encodeURIComponent(match)}`;
      onFieldChange(index, 'link', link);
    }
  };

  return (
    <div className="card-form-container" data-info-key="activeLinks">
      <div className="card-info-form-header">
        <span>Тип</span>
        <span>Ссылка</span>
        <span>Текст</span>
      </div>

      {formFields?.map((field, index) => (
        <div key={index} className="card-info-form-row">
          <CustomSelect
            value={field.type}
            onChange={(value) => handleTypeChange(index, value)}
            options={fieldOptions}
          />

          <input
            type="text"
            className="custom-input"
            value={field.link}
            onChange={(e) => onFieldChange(index, 'link', e.target.value)}
            placeholder={
              field.type === 'url'
                ? 'https://example.com'
                : field.type === 'phone'
                  ? 'tel:+79991234567'
                  : field.type === 'email'
                    ? 'mailto:user@example.com'
                    : 'https://yandex.ru/maps/?text=...'
            }
          />

          {field.type === 'address' ? (
            <>
              <input
                type="text"
                list={`address-list-${index}`}
                className="custom-input"
                value={field.text}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                placeholder="Введите адрес"
              />
              <datalist id={`address-list-${index}`}>
                {knownAddresses.map((addr, i) => (
                  <option key={i} value={addr} />
                ))}
              </datalist>
            </>
          ) : (
            <input
              type="text"
              className="custom-input"
              value={field.text}
              onChange={(e) => onFieldChange(index, 'text', e.target.value)}
              placeholder="Отображаемый текст"
            />
          )}

          <button
            className="card-form-delete-btn"
            onClick={() => onRemoveField(index)}
            aria-label="Удалить поле"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button
        className="card-form-add-btn"
        onClick={() =>
          onAddField({
            type: 'url',
            link: 'https://',
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

export default ActiveLinks;
