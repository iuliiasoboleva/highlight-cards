import React, { useMemo, useState } from 'react';

import CustomInput from '../../../customs/CustomInput';
import {
  CheckboxGroup,
  Confirmation,
  DangerButton,
  DeleteSection,
  DeleteTextarea,
  Label,
  Note,
} from '../styles';

const DeleteAccountSection = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState({
    reason1: false,
    reason2: false,
    reason3: false,
    other: '',
  });
  const [confirmDelete, setConfirmDelete] = useState('');

  const reasonProvided = useMemo(
    () => feedback.reason1 || feedback.reason2 || feedback.reason3 || feedback.other.trim(),
    [feedback],
  );

  const handleCheckbox = (key) => {
    setFeedback((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (!reasonProvided) return;
    if (confirmDelete.trim().toUpperCase() !== 'ПОДТВЕРЖДАЮ') return;
    onSubmit(feedback);
  };

  return (
    <DeleteSection>
      <h3>Удаление аккаунта</h3>
      <Label>
        Перед удалением аккаунта сообщите, пожалуйста, причину. Это поможет нам улучшить сервис.
      </Label>

      <CheckboxGroup>
        <Label>
          <input
            type="checkbox"
            checked={feedback.reason1}
            onChange={() => handleCheckbox('reason1')}
          />{' '}
          Сложно разобраться в интерфейсе
        </Label>
        <Label>
          <input
            type="checkbox"
            checked={feedback.reason2}
            onChange={() => handleCheckbox('reason2')}
          />{' '}
          Нет нужного мне функционала
        </Label>
        <Label>
          <input
            type="checkbox"
            checked={feedback.reason3}
            onChange={() => handleCheckbox('reason3')}
          />{' '}
          Не использую сервис
        </Label>
      </CheckboxGroup>

      <DeleteTextarea
        value={feedback.other}
        placeholder="Другая причина (укажите подробнее)"
        onChange={(e) => setFeedback((prev) => ({ ...prev, other: e.target.value }))}
      />

      <Confirmation>
        <h4>Подтверждение удаления</h4>
        <Label>
          Для подтверждения введите <strong>ПОДТВЕРЖДАЮ</strong>
        </Label>
        <CustomInput
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          placeholder="Введите ПОДТВЕРЖДАЮ"
        />
        <Note>Внимание! После удаления аккаунта все ваши данные будут безвозвратно утеряны.</Note>
      </Confirmation>

      <DangerButton
        type="button"
        onClick={handleDelete}
        disabled={!reasonProvided || confirmDelete.trim().toUpperCase() !== 'ПОДТВЕРЖДАЮ'}
      >
        Удалить аккаунт
      </DangerButton>
    </DeleteSection>
  );
};

export default DeleteAccountSection;
