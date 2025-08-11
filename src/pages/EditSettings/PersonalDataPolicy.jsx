import React from 'react';

import ToggleSwitch from '../../components/ToggleSwitch';
import CustomTooltip from '../../customs/CustomTooltip';

import './styles.css';

const PersonalDataPolicy = ({ settings, onToggle, onTextChange }) => {
  const isDisabled = !settings?.policyEnabled;

  return (
    <>
      <div className="policy-section">
        <div className="policy-header">
          <h3 className="barcode-radio-title">Политика использования персональных данных</h3>
          <CustomTooltip
            id="policy-help"
            html
            content={`Можно указать текст политики конфиденциальности, а также включить/выключить отображение текста`}
          />
          <ToggleSwitch
            checked={settings?.policyEnabled}
            onChange={() => onToggle('policyEnabled')}
          />
        </div>
        <div className="policy-textarea-wrapper">
          <textarea
            className={`policy-textarea ${isDisabled ? 'disabled' : ''}`}
            value={settings?.policyText}
            onChange={(e) => onTextChange('policyText', e.target.value)}
            disabled={isDisabled}
          />
          <span className="required-asterisk">*</span>
        </div>
      </div>

      <div className="policy-section policy-bordered">
        <div className="policy-bordered-header">
          <h3 className="barcode-radio-title">Согласие на обработку персональных данных</h3>
          <CustomTooltip
            id="agreement-help"
            html
            content={`Влияет на отображение чекбокса Согласие на обработку персональных данных`}
          />
          <ToggleSwitch
            checked={settings?.consentEnabled}
            onChange={() => onToggle('consentEnabled')}
          />
        </div>
      </div>

      <div className="policy-section">
        <div className="policy-header">
          <h3 className="barcode-radio-title">
            Политика использования персональных данных (полный текст)
          </h3>
        </div>
        <div className="policy-textarea-wrapper">
          <textarea
            className={`policy-textarea ${isDisabled ? 'disabled' : ''}`}
            value={settings?.fullPolicyText}
            onChange={(e) => onTextChange('fullPolicyText', e.target.value)}
            disabled={isDisabled}
          />
          <span className="required-asterisk">*</span>
        </div>
      </div>
    </>
  );
};

export default PersonalDataPolicy;
