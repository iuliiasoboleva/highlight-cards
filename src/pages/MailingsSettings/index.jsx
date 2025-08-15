import React, { useState } from 'react';

import ConnectModal from '../../components/ConnectModal';
import CustomMainButton from '../../customs/CustomMainButton';
import { mockServices } from '../../mocks/mockServices';

import './styles.css';

const MailingsSettings = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="mailings-settings-container">
      <h2>Настройки рассылки</h2>
      <div className="mailings-grid">
        {mockServices.map((service) => (
          <div key={service.id} className="mailings-card">
            <div>
              <div className="mailings-card-header">
                <h3>{service.name}</h3>
                {service.icon && (
                  <img src={service.icon} alt={service.name} className="mailings-card-icon" />
                )}
              </div>
              <p>{service.description}</p>
              {service.link && (
                <p className="mailing-instruction">
                  Инструкция:{' '}
                  <a href={service.link} target="_blank" rel="noreferrer">
                    {service.link}
                  </a>
                </p>
              )}
            </div>
            <CustomMainButton onClick={() => setSelectedService(service)}>
              Подключить аккаунт
            </CustomMainButton>
          </div>
        ))}
      </div>

      {selectedService && (
        <ConnectModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
};

export default MailingsSettings;
