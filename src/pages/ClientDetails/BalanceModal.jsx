import React from 'react';

import CustomInput from '../../customs/CustomInput';
import CustomModal from '../../customs/CustomModal';
import CustomTextArea from '../../customs/CustomTextarea';
import { Label } from '../EditDesign/styles';

const BalanceModal = ({ type, onClose }) => {
  const titleText =
    type === 'increase' ? 'Насколько увеличить баланс?' : 'Насколько уменьшить баланс?';

  return (
    <CustomModal
      open
      onClose={onClose}
      title="Изменение баланса"
      maxWidth={500}
      closeOnOverlayClick={false}
      actions={
        <>
          <CustomModal.PrimaryButton type="button">Применить</CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton type="button" onClick={onClose}>
            Отменить
          </CustomModal.SecondaryButton>
        </>
      }
    >
      <p style={{ marginBottom: 12 }}>{titleText}</p>

      <p style={{ marginBottom: 12 }}>
        Для: <strong></strong>
      </p>

      <Label>Значение:</Label>
      <CustomInput type="number" placeholder="Введите значение" />

      <Label>Сумма покупки:</Label>
      <CustomInput type="number" placeholder="₽" />

      <Label>Комментарий:</Label>
      <CustomTextArea placeholder="Комментарий (необязательно)" />
    </CustomModal>
  );
};

export default BalanceModal;
