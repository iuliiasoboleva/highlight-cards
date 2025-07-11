import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';

import PwaIcon from '../../assets/icons/pwa.svg';
import Accordion from '../../components/Accordion';

import './styles.css';

const GetPassPage = () => {
  const card = useSelector((state) => state.cards.currentCard);

  const accordionItems = [
    { title: 'Информация о компании', content: card.infoFields?.companyName || '...' },
    { title: 'Информация о карте', content: card.infoFields?.howToGetStamp || '...' },
    {
      title: 'Политика использования персональных данных',
      content: card.policySettings?.fullPolicyText || '...',
    },
    { title: 'Условия использования', content: card.infoFields?.fullPolicyText || '...' },
  ];

  const [formData, setFormData] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [consent, setConsent] = useState({
    terms: false,
    marketing: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleBlur = (name) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConsent((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', { ...formData, ...consent });
  };

  if (!card) return <div>Загрузка...</div>;

  return (
    <div className="getpass-container">
      <div className="getpass-header">
        <div className="getpass-header-bar">
          <div className="getpass-header-content">{card?.title || ''}</div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <h1 className="getpass-title">
          {card.infoFields?.description || 'Получайте бонусные баллы за каждую покупку.'}
        </h1>
        <div className="form-block">
          <form onSubmit={handleSubmit} className="auth-form">
            {card.issueFormFields.map((field) => (
              <div key={field.name}>
                {field.type === 'phone' ? (
                  <PhoneInput
                    country={'ru'}
                    value={formData.phone || ''}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phone',
                      required: field.required,
                      className: 'custom-input',
                    }}
                    containerStyle={{ width: '100%' }}
                    inputStyle={{ width: '100%', paddingLeft: 48 }}
                  />
                ) : (
                  <input
                    name={field.name}
                    placeholder={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field.name)}
                    required={field.required}
                    className={`custom-input ${
                      touchedFields[field.name] && field.required && !formData[field.name]
                        ? 'input-error'
                        : ''
                    }`}
                    type={
                      field.type === 'email'
                        ? 'email'
                        : field.type === 'number'
                          ? 'number'
                          : field.type === 'date'
                            ? 'date'
                            : 'text'
                    }
                    pattern={
                      field.type === 'text'
                        ? "^[A-Za-zА-Яа-яЁё\\s'-]{2,}$"
                        : field.type === 'number'
                          ? '^\\d+$'
                          : undefined
                    }
                  />
                )}
              </div>
            ))}

            {card.policySettings?.policyEnabled && (
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="terms"
                  checked={consent.terms}
                  onChange={handleCheckboxChange}
                  required
                />
                <span className="checkbox-label-text">
                  Я прочитал и принимаю{' '}
                  <a href="https://loyalclub.ru/oferta" target="_blank" rel="noreferrer">
                    условия использования
                  </a>
                  .
                </span>
              </label>
            )}

            <label className="custom-checkbox">
              <input
                type="checkbox"
                name="marketing"
                checked={consent.marketing}
                onChange={handleCheckboxChange}
                required
              />
              <span className="checkbox-label-text">
                Я согласен с тем, что мои личные данные могут использоваться и предоставляться для
                целей прямого маркетинга.
              </span>
            </label>

            <button type="submit" className="getpass-install-pwa">
              <img src={PwaIcon} alt="PWA" className="getpass-install-icon" />
              <span>Установить на домашний экран</span>
            </button>
          </form>
          <div className="accordions-wrapper">
            {accordionItems.map((item, index) => (
              <Accordion key={item.title} title={item.title} content={item.content} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPassPage;
