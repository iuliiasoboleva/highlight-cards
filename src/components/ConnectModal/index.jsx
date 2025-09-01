import React from 'react';

import CustomInput from '../../customs/CustomInput';
import CustomModal from '../../customs/CustomModal';
import { Actions, Form } from './styles';

const ConnectModal = ({ service, onClose, onSubmit }) => {
  if (!service) return null;

  return (
    <CustomModal
      open={!!service}
      onClose={onClose}
      title={`Подключение аккаунта ${service.name}`}
      maxWidth={400}
      actions={null}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        {service.fields.map((field, index) => (
          <CustomInput key={index} type="text" placeholder={field} required />
        ))}

        <Actions>
          <CustomModal.PrimaryButton type="submit">Подключить</CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton type="button" onClick={onClose}>
            Отменить
          </CustomModal.SecondaryButton>
        </Actions>
      </Form>
    </CustomModal>
  );
};

export default ConnectModal;
