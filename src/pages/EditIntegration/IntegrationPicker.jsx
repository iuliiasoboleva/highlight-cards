import React, { useState } from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

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

const ConfiguredBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfiguredText = styled.div`
  font-size: 11px;
  color: #22c55e;
  margin-top: 4px;
  font-weight: 500;
`;

const CardWrapper = styled.div`
  position: relative;
`;

const IntegrationPicker = ({ value, onChange, className, isCreatingCard, onPendingIntegration, pendingIntegration }) => {
  const [showRKeeperModal, setShowRKeeperModal] = useState(false);
  const [localPending, setLocalPending] = useState(null);

  const handleClick = (item) => {
    if (!item.enabled) return;
    
    if (item.key === 'r_keeper') {
      setShowRKeeperModal(true);
    }
    
    onChange(item.key);
  };

  const handlePendingSave = (data) => {
    setLocalPending(data);
    if (onPendingIntegration) {
      onPendingIntegration(data);
    }
  };

  const isConfigured = (key) => {
    if (pendingIntegration?.type === key) return true;
    if (localPending?.type === key) return true;
    return false;
  };

  return (
    <>
      <Grid className={className} role="radiogroup" aria-label="Выбор интеграции">
        {INTEGRATIONS.map((item) => {
          const selected = value === item.key;
          const disabled = !item.enabled;
          const configured = isCreatingCard && isConfigured(item.key);
          
          return (
            <CardWrapper key={item.key}>
              {configured && (
                <ConfiguredBadge>
                  <Check size={14} />
                </ConfiguredBadge>
              )}
              <Card
                type="button"
                role="radio"
                aria-checked={selected}
                $selected={selected || configured}
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
                {configured && <ConfiguredText>Настроено</ConfiguredText>}
              </Card>
            </CardWrapper>
          );
        })}
      </Grid>
      
      {showRKeeperModal && (
        <RKeeperModal 
          onClose={() => setShowRKeeperModal(false)} 
          isCreatingCard={isCreatingCard}
          onPendingIntegration={handlePendingSave}
        />
      )}
    </>
  );
};

export default IntegrationPicker;
