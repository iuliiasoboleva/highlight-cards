import React from 'react';
import { useDispatch } from 'react-redux';

import ToggleSwitch from '../../components/ToggleSwitch';
import { updateCurrentCardField } from '../../store/cardsSlice';

import './styles.css';

const PolicyFields = ({ policyEnabled, fullPolicyText, linkToFullTerms }) => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(
      updateCurrentCardField({
        path: 'infoFields.policyEnabled',
        value: !policyEnabled,
      }),
    );
  };

  const handleChange = (key, value) => {
    dispatch(updateCurrentCardField({ path: `infoFields.${key}`, value }));
  };

  return (
    <>
      <div className="policy-section">
        <div className="policy-header">
          <h3 className="barcode-radio-title">Условия использования</h3>
          <ToggleSwitch checked={policyEnabled} onChange={handleToggle} />
        </div>

        <div className="policy-textarea-wrapper">
          <textarea
            className={`policy-textarea ${!policyEnabled ? 'disabled' : ''}`}
            value={fullPolicyText || ''}
            onChange={(e) => handleChange('fullPolicyText', e.target.value)}
            disabled={!policyEnabled}
          />
          <span className="required-asterisk">*</span>
        </div>
      </div>

      <h3 className="barcode-radio-title">Ссылка на полные условия (необязательно)</h3>
      <input
        type="text"
        className="custom-input"
        value={linkToFullTerms || ''}
        onChange={(e) => handleChange('linkToFullTerms', e.target.value)}
        placeholder="Введите URL ссылки на условия использования сервиса на вашем сайте"
        disabled={!policyEnabled}
      />
    </>
  );
};

export default PolicyFields;
