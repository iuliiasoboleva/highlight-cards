import React, { useState } from 'react';

import CustomInput from '../../customs/CustomInput';
import CustomModal from '../../customs/CustomModal';
import { Label } from '../EditDesign/styles';
import { FormWrapper } from './styles';

const IssueFieldsModal = ({ fields = [], onClose, onSave }) => {
  const [formState, setFormState] = useState(fields?.map((field) => ({ ...field })));

  const handleChange = (index, value) => {
    const updated = [...formState];
    updated[index].value = value;
    setFormState(updated);
  };

  const handleSubmit = () => {
    onSave?.(formState);
    onClose?.();
  };

  return (
    <CustomModal
      open
      onClose={onClose}
      title="Поля"
      maxWidth={500}
      closeOnOverlayClick={false}
      actions={
        <>
          <CustomModal.PrimaryButton type="button" onClick={handleSubmit}>
            Сохранить
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton type="button" onClick={onClose}>
            Закрыть
          </CustomModal.SecondaryButton>
        </>
      }
    >
      <FormWrapper>
        {formState?.map((field, i) => (
          <div key={i}>
            <Label>{field.label}</Label>
            <CustomInput
              type={field.type === 'date' ? 'date' : 'text'}
              value={field.value ?? ''}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))}
      </FormWrapper>
    </CustomModal>
  );
};

export default IssueFieldsModal;
