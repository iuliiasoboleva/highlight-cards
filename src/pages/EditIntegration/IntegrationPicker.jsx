import React from 'react';

import oneCIcon from '../../assets/1c.png';
import iikoIcon from '../../assets/iiko.png';
import rkeeperIcon from '../../assets/rkeeper.png';
import yclientsIcon from '../../assets/yclients.png';
import { Card, Grid, LogoBox, Name, RadioHidden } from './styles';

const INTEGRATIONS = [
  { key: 'r_keeper', name: 'R_keeper', logo: rkeeperIcon },
  { key: 'yclients', name: 'YClients', logo: yclientsIcon },
  { key: '1c', name: '1C', logo: oneCIcon },
  { key: 'iiko', name: 'iiko', logo: iikoIcon },
];

const IntegrationPicker = ({ value, onChange, className }) => {
  return (
    <Grid className={className} role="radiogroup" aria-label="Выбор интеграции">
      {INTEGRATIONS.map((item) => {
        const selected = value === item.key;
        return (
          <Card
            key={item.key}
            type="button"
            role="radio"
            aria-checked={selected}
            $selected={selected}
            $disabled={true}
            title="Совсем скоро здесь будет доступна настройка интеграции"
            onClick={(e) => e.preventDefault()}
            onKeyDown={(e) => e.preventDefault()}
          >
            <RadioHidden
              type="radio"
              checked={selected}
              onChange={() => {}}
              aria-hidden
              tabIndex={-1}
              disabled
            />
            <LogoBox>
              {item.logo ? <img src={item.logo} alt="" /> : <span>{item.name}</span>}
            </LogoBox>
            <Name>{item.name}</Name>
          </Card>
        );
      })}
    </Grid>
  );
};

export default IntegrationPicker;
