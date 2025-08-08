import { useCallback, useRef, useState } from 'react';

const usePinInput = () => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const newPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handlePinChange = useCallback(
    (type, index, value) => {
      if (!/\d?/.test(value)) return;
      const digit = value.slice(-1);
      const source = type === 'new' ? newPin : confirmPin;
      const arr = source.padEnd(4, ' ').split('');
      arr[index] = digit;
      const pin = arr.join('').trim();
      if (type === 'new') setNewPin(pin);
      else setConfirmPin(pin);
      if (digit && index < 3) {
        const refs = type === 'new' ? newPinRefs : confirmPinRefs;
        refs[index + 1].current?.focus();
      }
    },
    [newPin, confirmPin],
  );

  const handlePinKey = useCallback(
    (type, index, e) => {
      if (e.key !== 'Backspace') return;
      e.preventDefault();
      const isNew = type === 'new';
      const value = isNew ? newPin : confirmPin;
      const refs = isNew ? newPinRefs : confirmPinRefs;
      const arr = value.padEnd(4, ' ').split('');
      if (arr[index]) {
        arr[index] = '';
        if (index > 0) refs[index - 1].current?.focus();
      } else if (index > 0) {
        refs[index - 1].current?.focus();
        arr[index - 1] = '';
      }
      const pin = arr.join('').trim();
      isNew ? setNewPin(pin) : setConfirmPin(pin);
    },
    [newPin, confirmPin],
  );

  const resetPins = useCallback(() => {
    setNewPin('');
    setConfirmPin('');
  }, []);

  return {
    newPin,
    confirmPin,
    newPinRefs,
    confirmPinRefs,
    handlePinChange,
    handlePinKey,
    resetPins,
  };
};

export default usePinInput;
