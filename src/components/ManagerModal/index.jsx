import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomSelect from '../CustomSelect';
import ConfirmModal from '../ConfirmModal';

const ManagerModal = ({ isOpen, onClose, onSave, onDelete, initialData = {}, isEdit = false }) => {
  const [manager, setManager] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    location: '',
    shift: { startShift: '', endShift: '' },
    status: 'Активен',
    ...initialData,
  });

  const locations = useSelector((state) => state.locations.list);

  const locationOptions = locations.map((l) => ({ value: l.name, label: l.name }));
  const statusOptions = [
    { value: 'Активен', label: 'Активен' },
    { value: 'Заблокирован', label: 'Заблокирован' },
  ];

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';

    const parts = [
      '+7',
      digits.slice(1, 4),
      digits.slice(4, 7),
      digits.slice(7, 9),
      digits.slice(9, 11),
    ];

    let formatted = `${parts[0]}`;
    if (parts[1]) formatted += `(${parts[1]}`;
    if (parts[1] && parts[1].length === 3) formatted += ')';
    if (parts[2]) formatted += `-${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;
    if (parts[4]) formatted += `-${parts[4]}`;

    return formatted;
  };

  useEffect(() => {
    setManager({
      name: '',
      surname: '',
      email: '',
      phone: '',
      location: '',
      shift: { startShift: '', endShift: '' },
      status: 'Активен',
      ...initialData,
    });
  }, [initialData]);

  if (!isOpen) return null;

  const phoneDigits = manager.phone.replace(/\D/g, '');
  const isFormValid =
    manager.name &&
    manager.surname &&
    /^\S+@\S+\.\S+$/.test(manager.email) &&
    phoneDigits.length === 11 &&
    manager.shift?.startShift &&
    manager.shift?.endShift;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Редактировать менеджера' : 'Добавить менеджера'}</h3>
        <input
          type="text"
          placeholder="Имя"
          value={manager.name}
          onChange={(e) => setManager({ ...manager, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={manager.surname}
          onChange={(e) => setManager({ ...manager, surname: e.target.value })}
        />
        <CustomSelect
          value={manager.location}
          onChange={(val) => setManager({ ...manager, location: val })}
          options={locationOptions}
          placeholder="Точка продаж"
          className="modal-select"
        />
        <input
          type="email"
          placeholder="Email"
          value={manager.email}
          onChange={(e) => setManager({ ...manager, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={manager.phone}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            setManager({ ...manager, phone: formatted });
          }}
        />
        <input
          type="time"
          placeholder="Начало смены"
          value={manager.shift?.startShift || ''}
          onChange={(e) =>
            setManager((prev) => ({
              ...prev,
              shift: {
                ...prev.shift,
                startShift: e.target.value,
              },
            }))
          }
        />
        <input
          type="time"
          placeholder="Конец смены"
          value={manager.shift?.endShift || ''}
          onChange={(e) =>
            setManager((prev) => ({
              ...prev,
              shift: {
                ...prev.shift,
                endShift: e.target.value,
              },
            }))
          }
        />
        <CustomSelect
          value={manager.status}
          onChange={(val) => setManager({ ...manager, status: val })}
          options={statusOptions}
          className="modal-select"
        />
        <div className="modal-buttons">
          <button className="btn btn-dark" onClick={() => onSave(manager)} disabled={!isFormValid}>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </button>
          {isEdit && (
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Удалить
            </button>
          )}
          <button className="btn-light" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        message="Удалить сотрудника без возможности восстановления? Вы всегда можете просто заблокировать его."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={() => {
          onDelete(manager.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default ManagerModal;
