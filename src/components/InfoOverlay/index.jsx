import React from 'react';

import { X } from 'lucide-react';

import './styles.css';

const fieldLabels = {
  description: 'Описание карты',
  howToGetStamp: 'Как получить штамп',
  companyName: 'Название компании',
  rewardDescription: 'Описание награды',
  stampMessage: 'Сообщение о штампе',
  claimRewardMessage: 'Сообщение о награде',
  stampsQuantity: 'Количество штампов',
  activeStamp: 'Активный штамп',
  inactiveStamp: 'Неактивный штамп',
  logo: 'Логотип',
  icon: 'Иконка',
  stampBackground: 'Фон штампов',
  // multiRewards: 'Мультинаграды',
  autoRedeem: 'Автосписание награды',
  referralProgramActive: 'Реферальная программа активна',
  referralMoment: 'Момент начисления',
  referrerStampsQuantity: 'Штампы для реферера',
  referralStampsQuantity: 'Штампы для реферала',
  activeLinks: 'Активные ссылки',
  reviewLinks: 'Ссылки на отзывы',
  fullPolicyText: 'Полный текст политики',
  linkToFullTerms: 'Ссылка на полные условия',
  policyEnabled: 'Политика включена',
  issuerName: 'Имя отправителя',
  issuerEmail: 'Email отправителя',
  issuerPhone: 'Телефон отправителя',
};

const valueFormatters = {
  autoRedeem: (v) => (v ? 'Да' : 'Нет'),
  referralProgramActive: (v) => (v ? 'Да' : 'Нет'),
  referralMoment: (v) => (v === 'visit' ? 'Первого визита' : v === 'issue' ? 'Выдачи карты' : v),
  // multiRewards: (v) => (Array.isArray(v) && v.length > 0 ? v.join(', ') : 'Не указаны'),
  policyEnabled: (v) => (v ? 'Да' : 'Нет'),
  activeLinks: (v) =>
    Array.isArray(v) && v.length
      ? v.map((link) => `${link.text || 'Без названия'} → ${link.link || '—'}`).join('\n')
      : 'Нет ссылок',
  reviewLinks: (v) =>
    Array.isArray(v) && v.length
      ? v
          .map((link) => `${link.text || 'Без названия'} (${link.type}): ${link.link || '—'}`)
          .join('\n')
      : 'Нет отзывов',
};

const InfoOverlay = ({ infoFields, onClose, onFieldClick }) => {
  if (!infoFields) return null;

  return (
    <div className="info-overlay">
      <div className="info-overlay-header">
        <h3>Информация</h3>
        <button className="info-overlay-close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="info-overlay-content">
        {Object.entries(infoFields)
          .filter(([key]) => key !== 'multiRewards')
          .map(([key, value]) => {
            const label = fieldLabels[key] || key;
            const formattedValue = valueFormatters[key]
              ? valueFormatters[key](value)
              : Array.isArray(value)
                ? value.join(', ')
                : String(value);

            return (
              <div key={key} className="info-overlay-item">
                <strong>{label}:</strong>{' '}
                {String(formattedValue).includes('\n') ? (
                  <div
                    className="info-overlay-multiline"
                    onClick={() => onFieldClick && onFieldClick(key)}
                  >
                    {String(formattedValue)
                      .split('\n')
                      .map((line, i) => {
                        const [labelPart, linkPart] = line.split(/ → |: /);
                        return (
                          <div key={i} className="info-overlay-link-line">
                            <span className="info-overlay-link-label">{labelPart}</span>{' '}
                            {linkPart && (
                              <div className="info-overlay-link-value" title={linkPart}>
                                {linkPart}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <span
                    className="info-overlay-link-value"
                    title={formattedValue}
                    onClick={() => onFieldClick && onFieldClick(key)}
                  >
                    {formattedValue || 'Нет данных'}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InfoOverlay;
