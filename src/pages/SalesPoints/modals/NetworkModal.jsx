import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import BranchCheckboxList from '../../../components/BranchCheckboxList';
import CustomInput from '../../../customs/CustomInput';
import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import CustomTextArea from '../../../customs/CustomTextarea';
import { Field, Label } from '../styles';

const Title = ({ isEdit, confirming }) => (
  <span>
    {confirming
      ? 'Удалить сеть без возможности восстановления?'
      : isEdit
        ? 'Редактировать сеть'
        : 'Создать сеть'}
  </span>
);

const NetworkModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete = () => {},
  initialData = {},
  isEdit,
}) => {
  const branches = useSelector((state) => state.locations.list);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const availableBranches = useMemo(() => {
    if (isEdit) return branches.filter((b) => !b.network_id || b.network_id === initialData.id);
    return branches.filter((b) => !b.network_id);
  }, [branches, isEdit, initialData.id]);

  const needScroll = availableBranches.length > 7;

  useEffect(() => {
    if (!isOpen) return;

    setName(initialData.name || '');
    setDescription(initialData.description || '');
    setConfirmingDelete(false);

    if (isEdit) {
      const preselected = branches.filter((b) => b.network_id === initialData.id).map((b) => b.id);
      setSelectedBranches(preselected);
    } else {
      setSelectedBranches([]);
    }
  }, [initialData, isOpen, branches, isEdit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave?.({
      id: initialData.id,
      name: name.trim(),
      description,
      branches: selectedBranches,
    });
  };

  const actionsNormal = (
    <>
      {isEdit && (
        <CustomMainButton
          onClick={() => setConfirmingDelete(true)}
          style={{ background: '#e53935', maxWidth: '100%' }}
        >
          Удалить
        </CustomMainButton>
      )}
      <CustomMainButton onClick={handleSave} disabled={!name.trim()} style={{ maxWidth: '100%' }}>
        Сохранить
      </CustomMainButton>
    </>
  );

  const actionsConfirm = (
    <>
      <CustomMainButton
        onClick={() => {
          onDelete(initialData.id);
          setConfirmingDelete(false);
          onClose?.();
        }}
        style={{ background: '#e53935', maxWidth: '100%' }}
      >
        Удалить
      </CustomMainButton>
      <CustomMainButton
        onClick={() => setConfirmingDelete(false)}
        style={{ background: '#f5f5f5', color: '#2c3e50', maxWidth: '100%' }}
      >
        Отмена
      </CustomMainButton>
    </>
  );

  return (
    <CustomModal
      open={isOpen}
      onClose={() => {
        setConfirmingDelete(false);
        onClose?.();
      }}
      title={<Title isEdit={isEdit} confirming={confirmingDelete} />}
      actions={confirmingDelete ? actionsConfirm : actionsNormal}
    >
      {confirmingDelete ? (
        <Label style={{ color: '#2c3e50' }}>Все связанные точки останутся без сети.</Label>
      ) : (
        <>
          <Field>
            <Label>Название сети</Label>
            <CustomInput
              placeholder="Введите название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label>Описание</Label>
            <CustomTextArea
              placeholder="Опционально"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Выберите точки продаж</Label>
            <BranchCheckboxList
              items={availableBranches}
              selected={selectedBranches}
              onChange={setSelectedBranches}
              emptyText="Нет доступных точек."
              maxHeight={needScroll ? 220 : 'auto'}
            />
          </Field>
        </>
      )}
    </CustomModal>
  );
};

export default NetworkModal;
