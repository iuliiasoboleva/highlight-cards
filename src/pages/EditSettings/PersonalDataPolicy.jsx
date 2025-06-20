import React from 'react';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import ToggleSwitch from '../../components/ToggleSwitch';

import './styles.css';

const PersonalDataPolicy = ({ settings, onToggle, onTextChange }) => {
  const isDisabled = !settings?.policyEnabled;

  return (
    <>
      <div className="policy-section">
        <div className="policy-header">
          <h3 className="barcode-radio-title">
            Политика использования персональных данных
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="policy-help"
              data-tooltip-html="Можно указать текст политики конфиденциальности, а также включить/выключить отображение текста"
            />
          </h3>
          <Tooltip id="policy-help" className="custom-tooltip" />
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
          <h3 className="barcode-radio-title">
            Согласие на обработку персональных данных
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="agreement-help"
              data-tooltip-html="Влияет на отображение чекбокса Согласие на обработку персональных данных"
            />
          </h3>
          <Tooltip id="agreement-help" className="custom-tooltip" />
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
