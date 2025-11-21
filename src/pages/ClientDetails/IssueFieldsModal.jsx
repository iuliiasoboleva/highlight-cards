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
            {field.type === 'gender' ? (
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`gender-${i}`}
                    value="male"
                    checked={field.value === 'male'}
                    onChange={(e) => handleChange(i, e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>М</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`gender-${i}`}
                    value="female"
                    checked={field.value === 'female'}
                    onChange={(e) => handleChange(i, e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Ж</span>
                </label>
              </div>
            ) : (
              <CustomInput
                type={field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                value={field.value ?? ''}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            )}
          </div>
        ))}
      </FormWrapper>
    </CustomModal>
  );
};

export default IssueFieldsModal;
