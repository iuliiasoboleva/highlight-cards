import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ClientContactFields = ({ name, email, phone, onChange }) => {
  return (
    <div className="client-contact-row">
      <div className="client-contact-wrapper">
        <input
          type="text"
          value={name || ''}
          onChange={(e) => onChange('issuerName', e.target.value)}
          className="custom-input"
          placeholder="Название компании"
        />
      </div>
      <div className="client-contact-wrapper">
        <input
          type="email"
          value={email || ''}
          onChange={(e) => onChange('issuerEmail', e.target.value)}
          className="custom-input"
          placeholder="Email"
        />
      </div>
      <div className="client-contact-wrapper">
        <PhoneInput
          country="ru"
          value={phone || ''}
          onChange={(val) => onChange('issuerPhone', '+' + val)}
          inputStyle={{ width: '100%' }}
          inputProps={{ required: true }}
        />
      </div>
    </div>
  );
};

export default ClientContactFields;
