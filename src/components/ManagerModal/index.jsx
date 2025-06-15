import React, { useEffect, useState } from 'react';

const ManagerModal = ({ isOpen, onClose, onSave, onDelete, initialData = {}, isEdit = false }) => {
  const [manager, setManager] = useState({
    name: '',
    surname: '',
    location: '',
    shift: { startShift: '', endShift: '' },
    status: '',
    ...initialData,
  });

  useEffect(() => {
    setManager({
      name: '',
      surname: '',
      location: '',
      shift: { startShift: '', endShift: '' },
      status: '',
      ...initialData,
    });
  }, [initialData]);

  if (!isOpen) return null;

  const isFormValid = manager.name && manager.surname && manager.location && manager.shift;

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
        <input
          type="text"
          placeholder="Точка продаж"
          value={manager.location}
          onChange={(e) => setManager({ ...manager, location: e.target.value })}
        />
        <input
          type="text"
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
          type="text"
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

        <input
          type="text"
          placeholder="Статус"
          value={manager.status}
          onChange={(e) => setManager({ ...manager, status: e.target.value })}
        />
        <div className="modal-buttons">
          <button className="btn btn-dark" onClick={() => onSave(manager)} disabled={!isFormValid}>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </button>
          {isEdit && (
            <button className="btn btn-danger" onClick={() => onDelete(manager.id)}>
              Удалить
            </button>
          )}
          <button className="btn-light" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerModal;
