import React, { useRef } from 'react';

import CustomPinInput from '../../../customs/CustomPinInput';
import { CenteredLine, CustomButton, PinNote, PinTitle, SmsLink } from '../styles';

const PinStep = ({
  step, // 'pin' | 'pinLogin'
  pin,
  submitting,
  onChangePin,
  onPinChange,
  onSendLinkAgain,
  onComplete,
}) => {
  const prevRef = useRef(pin || '');

  const handleChange = (digits) => {
    if (typeof onChangePin === 'function') {
      onChangePin(digits);
    } else if (typeof onPinChange === 'function') {
      const prev = (prevRef.current || '').padEnd(4, ' ');
      const next = (digits || '').padEnd(4, ' ');
      for (let i = 0; i < 4; i++) {
        if (prev[i] !== next[i]) {
          onPinChange(i, /\d/.test(next[i]) ? next[i] : '');
        }
      }
    }
    prevRef.current = digits;
  };

  const isComplete = ((pin || '').match(/\d/g) || []).length === 4;

  return (
    <>
      <PinTitle>
        {step === 'pinLogin' ? 'Введите PIN-код' : 'Для быстрого входа придумайте PIN'}
      </PinTitle>

      <CustomPinInput
        value={pin}
        onChange={handleChange}
        onComplete={onComplete}
        disabled={submitting}
        autoFocus
      />

      <CustomButton type="submit" disabled={submitting || !isComplete}>
        {step === 'pinLogin' ? 'Войти' : 'Сохранить PIN'}
      </CustomButton>

      {step === 'pin' && <PinNote>Запомните PIN — он позволит входить без SMS-кода</PinNote>}
      {submitting && step === 'pin' && <PinNote>Проверяем...</PinNote>}

      {step === 'pinLogin' && (
        <CenteredLine>
          <SmsLink $disabled={submitting} onClick={submitting ? undefined : onSendLinkAgain}>
            {submitting ? 'Проверяем...' : 'Не помню PIN — войти по SMS'}
          </SmsLink>
        </CenteredLine>
      )}
    </>
  );
};

export default PinStep;
