import React from 'react';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

const ClientContactFields = ({ name, email, phone, onChange }) => {
  const formatPhone = (val) => {
    let digits = val.replace(/\D/g, '');
    if (!digits) return '';

    // гарантируем, что номер начинается с 7
    if (digits[0] !== '7') {
      digits = '7' + digits;
    }
    digits = digits.slice(0, 11); // максимум 11 цифр (+7 __________)

    let res = '+7';
    const rest = digits.slice(1);
    if (rest.length) {
      res += '(' + rest.slice(0, 3);
    }
    if (rest.length >= 3) {
      res += ')';
    }
    if (rest.length > 3) {
      res += rest.slice(3, 6);
    }
    if (rest.length >= 6) {
      res += '-' + rest.slice(6, 8);
    }
    if (rest.length >= 8) {
      res += '-' + rest.slice(8, 10);
    }
    return res;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange('issuerPhone', formatted);
  };

  return (
    <div className="client-contact-row">
      <div className="client-contact-wrapper">
        <input
          type="text"
          value={name || ''}
          onChange={(e) => onChange('issuerName', e.target.value)}
          className="custom-input"
          placeholder="Название компании"
          data-info-key="issuerName"
        />
      </div>
      <div className="client-contact-wrapper">
        <input
          type="email"
          value={email || ''}
          onChange={(e) => onChange('issuerEmail', e.target.value)}
          className="custom-input"
          placeholder="Email"
          data-info-key="issuerEmail"
        />
      </div>
      <div className="client-contact-wrapper">
        {/* Старое решение с react-phone-input-2 (оставлено на случай возврата)
        <PhoneInput
          country="ru"
          value={phone || ''}
          onChange={(val) => onChange('issuerPhone', '+' + val)}
          inputStyle={{ width: '100%' }}
          inputProps={{ required: true, 'data-info-key': 'issuerPhone' }}
        />
        */}
        <input
          type="tel"
          value={phone || ''}
          onChange={handlePhoneChange}
          className="custom-input"
          placeholder="Телефон"
          data-info-key="issuerPhone"
        />
      </div>
    </div>
  );
};

export default ClientContactFields;
