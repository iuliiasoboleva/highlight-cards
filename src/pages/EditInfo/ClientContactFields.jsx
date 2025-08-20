import React from 'react';

import CustomInput from '../../customs/CustomInput';
import { formatPhone } from '../../helpers/formatPhone';
import { Row, Wrapper } from './styles';

const ClientContactFields = ({ name, email, phone, onChange }) => {
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange('issuerPhone', formatted);
  };

  return (
    <Row>
      <Wrapper>
        <CustomInput
          type="text"
          value={name || ''}
          onChange={(e) => onChange('issuerName', e.target.value)}
          placeholder="Название компании"
          data-info-key="issuerName"
        />
      </Wrapper>

      <Wrapper>
        <CustomInput
          type="email"
          value={email || ''}
          onChange={(e) => onChange('issuerEmail', e.target.value)}
          placeholder="Email"
          data-info-key="issuerEmail"
        />
      </Wrapper>

      <Wrapper>
        <CustomInput
          type="tel"
          value={phone || ''}
          onChange={handlePhoneChange}
          placeholder="Телефон"
          data-info-key="issuerPhone"
        />
      </Wrapper>
    </Row>
  );
};

export default ClientContactFields;
