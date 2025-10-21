import React, { useMemo, useState } from 'react';

import CustomInput from '../../customs/CustomInput';
import CustomModal from '../../customs/CustomModal';
import { ButtonsRow, PresetBtn, PresetGrid } from './styles';

const presetAmounts = [500, 1000, 1500, 2000];

const TopUpModal = ({ isOpen, open, onClose, onConfirm }) => {
  const actuallyOpen = open ?? isOpen;
  const [amount, setAmount] = useState('');

  const num = useMemo(() => {
    const n = parseInt(amount, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amount]);

  if (!actuallyOpen) return null;

  const handleConfirm = () => {
    if (num > 0) onConfirm?.(num);
  };

  const onPreset = (a) => setAmount(String(a));

  return (
    <CustomModal
      open={actuallyOpen}
      onClose={onClose}
      title="Пополнить баланс"
      maxWidth={420}
      aria-label="Окно пополнения баланса"
    >
      <PresetGrid>
        {presetAmounts.map((a) => (
          <PresetBtn
            key={a}
            $active={String(a) === String(amount)}
            type="button"
            onClick={() => onPreset(a)}
            aria-pressed={String(a) === String(amount)}
          >
            {a.toLocaleString('ru-RU')} ₽
          </PresetBtn>
        ))}
      </PresetGrid>

      <CustomInput
        type="number"
        placeholder="Другая сумма"
        value={amount}
        onChange={(e) => {
          let raw = e.target.value;
          // Убираем лидирующие нули
          if (raw.length > 1 && raw.startsWith('0')) {
            raw = raw.replace(/^0+/, '') || '1';
            e.target.value = raw;
          }
          setAmount(raw);
        }}
        min={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleConfirm();
        }}
      />

      <ButtonsRow>
        <CustomModal.PrimaryButton
          onClick={handleConfirm}
          disabled={!num}
          style={{ minWidth: 120 }}
        >
          Пополнить
        </CustomModal.PrimaryButton>

        <CustomModal.SecondaryButton onClick={onClose}>Отмена</CustomModal.SecondaryButton>
      </ButtonsRow>
    </CustomModal>
  );
};

export default TopUpModal;
