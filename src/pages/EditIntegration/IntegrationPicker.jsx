import React, { useState } from 'react';

import oneCIcon from '../../assets/1c.png';
import iikoIcon from '../../assets/iiko.png';
import rkeeperIcon from '../../assets/rkeeper.png';
import yclientsIcon from '../../assets/yclients.png';
import { Card, Grid, LogoBox, Name, RadioHidden } from './styles';
import RKeeperModal from './RKeeperModal';

const INTEGRATIONS = [
  { key: 'r_keeper', name: 'R_keeper', logo: rkeeperIcon, enabled: true },
  { key: 'yclients', name: 'YClients', logo: yclientsIcon, enabled: false },
  { key: '1c', name: '1C', logo: oneCIcon, enabled: false },
  { key: 'iiko', name: 'iiko', logo: iikoIcon, enabled: false },
];

const IntegrationPicker = ({ value, onChange, className }) => {
  const [showRKeeperModal, setShowRKeeperModal] = useState(false);

  const handleClick = (item) => {
    if (!item.enabled) return;
    
    if (item.key === 'r_keeper') {
      setShowRKeeperModal(true);
    }
    
    onChange(item.key);
  };

  return (
    <>
      <Grid className={className} role="radiogroup" aria-label="Выбор интеграции">
        {INTEGRATIONS.map((item) => {
          const selected = value === item.key;
          const disabled = !item.enabled;
          
          return (
            <Card
              key={item.key}
              type="button"
              role="radio"
              aria-checked={selected}
              $selected={selected}
              $disabled={disabled}
              title={disabled ? 'Совсем скоро здесь будет доступна настройка интеграции' : `Настроить ${item.name}`}
              onClick={() => handleClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(item);
                }
              }}
            >
              <RadioHidden
                type="radio"
                checked={selected}
                onChange={() => {}}
                aria-hidden
                tabIndex={-1}
                disabled={disabled}
              />
              <LogoBox>
                {item.logo ? <img src={item.logo} alt="" /> : <span>{item.name}</span>}
              </LogoBox>
              <Name>{item.name}</Name>
            </Card>
          );
        })}
      </Grid>
      
      {showRKeeperModal && (
        <RKeeperModal onClose={() => setShowRKeeperModal(false)} />
      )}
    </>
  );
};

export default IntegrationPicker;
