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
  multiRewards: 'Мультинаграды',
  autoRedeem: 'Автосписание награды',
  referralProgramActive: 'Реферальная программа активна',
  referralMoment: 'Момент начисления',
  referrerStampsQuantity: 'Штампы для реферера',
  referralStampsQuantity: 'Штампы для реферала',
};

const valueFormatters = {
  autoRedeem: (v) => (v ? 'Да' : 'Нет'),
  referralProgramActive: (v) => (v ? 'Да' : 'Нет'),
  referralMoment: (v) => (v === 'visit' ? 'Первого визита' : v === 'issue' ? 'Выдачи карты' : v),
  multiRewards: (v) => (Array.isArray(v) && v.length > 0 ? v.join(', ') : 'Не указаны'),
};

const InfoOverlay = ({ infoFields, onClose }) => {
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
        {Object.entries(infoFields).map(([key, value]) => {
          const label = fieldLabels[key] || key;
          const formattedValue = valueFormatters[key]
            ? valueFormatters[key](value)
            : Array.isArray(value)
              ? value.join(', ')
              : String(value);

          return (
            <div key={key} className="info-overlay-item">
              <strong>{label}:</strong> <span>{formattedValue || 'Нет данных'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoOverlay;
