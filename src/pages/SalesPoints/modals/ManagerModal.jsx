import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import BranchCheckboxList from '../../../components/BranchCheckboxList';
import CustomInput from '../../../customs/CustomInput';
import CustomMainButton from '../../../customs/CustomMainButton';
import CustomModal from '../../../customs/CustomModal';
import CustomSelect from '../../../customs/CustomSelect';
import { formatPhone } from '../../../helpers/formatPhone';
import { ErrorText, Field, Hint, InlineRow, Label } from '../styles';

const NAME_RE = /^[A-Za-zА-Яа-яЁё\s-]+$/;

const ManagerModal = ({ isOpen, onClose, onSave, onDelete, initialData = {}, isEdit = false }) => {
  const locations = useSelector((state) => state.locations.list) || [];
  const allManagers = useSelector((state) => state.managers?.list) || [];

  const [manager, setManager] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    location: '',
    locations: [],
    shift: { startShift: '', endShift: '' },
    status: 'Активен',
    ...initialData,
  });

  const [selectedBranches, setSelectedBranches] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusOptions = [
    { value: 'Активен', label: 'Активен' },
    { value: 'Заблокирован', label: 'Заблокирован' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const init = {
      name: '',
      surname: '',
      email: '',
      phone: '',
      location: '',
      locations: [],
      shift: { startShift: '', endShift: '' },
      status: 'Активен',
      ...initialData,
    };

    setManager(init);

    // если в initialData есть массив locations/id — ставим его
    // иначе, если было одиночное `location` по имени — пытаемся найти id по имени
    if (Array.isArray(init.locations) && init.locations.length) {
      setSelectedBranches(init.locations);
    } else if (init.location) {
      const byName = locations.find((l) => l.name === init.location);
      setSelectedBranches(byName ? [byName.id] : []);
    } else {
      setSelectedBranches([]);
    }

    setConfirmOpen(false);
  }, [initialData, isOpen, locations]);

  const phoneDigits = (manager.phone || '').replace(/\D/g, '');

  // touched + ошибки
  const [touched, setTouched] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false,
    shiftStart: false,
    shiftEnd: false,
    branches: false,
  });

  useEffect(() => {
    if (!isOpen) {
      setTouched({
        name: false,
        surname: false,
        email: false,
        phone: false,
        shiftStart: false,
        shiftEnd: false,
        branches: false,
      });
    }
  }, [isOpen]);

  const errors = useMemo(() => {
    const e = {};
    if (!manager.name.trim()) e.name = 'Укажите имя';
    else if (!NAME_RE.test(manager.name.trim())) e.name = 'Только буквы, пробел и дефис';

    if (!manager.surname.trim()) e.surname = 'Укажите фамилию';
    else if (!NAME_RE.test(manager.surname.trim())) e.surname = 'Только буквы, пробел и дефис';

    if (!manager.email.trim() || !/^\S+@\S+\.\S+$/.test(manager.email.trim())) {
      e.email = 'Некорректный email';
    }

    if (phoneDigits.length !== 11) e.phone = 'Телефон должен содержать 11 цифр';

    if (!manager.shift?.startShift) e.shiftStart = 'Укажите начало смены';
    if (!manager.shift?.endShift) e.shiftEnd = 'Укажите конец смены';

    if (selectedBranches.length === 0) e.branches = 'Выберите хотя бы одну точку продаж';

    return e;
  }, [manager, phoneDigits, selectedBranches]);

  const duplicateExists = useMemo(() => {
    const name = manager.name.trim().toLowerCase();
    const surname = manager.surname.trim().toLowerCase();
    if (!name || !surname) return false;
    const currentId = initialData?.id;
    return allManagers.some((m) => {
      const sameId = currentId && m.id === currentId;
      if (sameId) return false;
      const mn = String(m.name || '').trim().toLowerCase();
      const ms = String(m.surname || '').trim().toLowerCase();
      return mn === name && ms === surname;
    });
  }, [allManagers, initialData?.id, manager.name, manager.surname]);

  if (!isOpen) return null;

  const isFormValid = Object.keys(errors).length === 0 && !duplicateExists;

  const title = confirmOpen
    ? 'Удалить сотрудника без возможности восстановления?'
    : isEdit
      ? 'Редактировать сотрудника'
      : 'Добавить сотрудника';

  const actions = confirmOpen ? (
    <>
      <CustomMainButton
        onClick={() => {
          onDelete?.(manager.id);
          setConfirmOpen(false);
          onClose?.();
        }}
        style={{ background: '#e53935', maxWidth: '100%' }}
      >
        Удалить
      </CustomMainButton>
      <CustomMainButton
        onClick={() => setConfirmOpen(false)}
        style={{ background: '#f5f5f5', color: '#2c3e50', maxWidth: '100%' }}
      >
        Отмена
      </CustomMainButton>
    </>
  ) : (
    <>
      {isEdit && (
        <CustomMainButton
          onClick={() => setConfirmOpen(true)}
          style={{ background: '#e53935', maxWidth: '100%' }}
        >
          Удалить
        </CustomMainButton>
      )}
      <CustomMainButton
        onClick={() => {
          if (!isFormValid) {
            setTouched({
              name: true,
              surname: true,
              email: true,
              phone: true,
              shiftStart: true,
              shiftEnd: true,
              branches: true,
            });
            return;
          }

          const firstId = selectedBranches[0];
          const firstById = locations.find((l) => l.id === firstId);
          const legacyLocationName = firstById?.name ?? '';

          onSave?.({
            ...manager,
            phone: phoneDigits,
            locations: selectedBranches,
            location: legacyLocationName,
          });
        }}
        disabled={!isFormValid}
        style={{ maxWidth: '100%' }}
      >
        {isEdit ? 'Сохранить' : 'Добавить'}
      </CustomMainButton>
      <CustomMainButton
        onClick={onClose}
        style={{ background: '#f5f5f5', color: '#2c3e50', maxWidth: '100%' }}
      >
        Отмена
      </CustomMainButton>
    </>
  );

  const red = '#c14857';

  return (
    <CustomModal open={isOpen} onClose={onClose} title={title} actions={actions}>
      {confirmOpen ? (
        <Hint style={{ color: '#2c3e50' }}>Вы всегда можете просто заблокировать его.</Hint>
      ) : (
        <>
          <InlineRow>
            <Field>
              <Label>Имя</Label>
              <CustomInput
                placeholder="Имя"
                value={manager.name}
                onChange={(e) => setManager({ ...manager, name: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                required
                style={touched.name && errors.name ? { borderColor: red } : undefined}
              />
              {touched.name && errors.name && <ErrorText>{errors.name}</ErrorText>}
            </Field>
            <Field>
              <Label>Фамилия</Label>
              <CustomInput
                placeholder="Фамилия"
                value={manager.surname}
                onChange={(e) => setManager({ ...manager, surname: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, surname: true }))}
                required
                style={touched.surname && errors.surname ? { borderColor: red } : undefined}
              />
              {touched.surname && errors.surname && <ErrorText>{errors.surname}</ErrorText>}
              {touched.name && touched.surname && duplicateExists && (
                <ErrorText>Сотрудник с таким именем уже существует</ErrorText>
              )}
            </Field>
          </InlineRow>

          <Field>
            <Label>Точки продаж</Label>
            <BranchCheckboxList
              items={locations}
              selected={selectedBranches}
              onChange={setSelectedBranches}
              onTouch={() => setTouched((t) => ({ ...t, branches: true }))}
              emptyText="Нет доступных точек."
              maxHeight={180}
            />
            {touched.branches && errors.branches && <ErrorText>{errors.branches}</ErrorText>}
          </Field>

          <InlineRow>
            <Field>
              <Label>Email</Label>
              <CustomInput
                type="email"
                placeholder="Email"
                value={manager.email}
                onChange={(e) => setManager({ ...manager, email: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                required
                style={touched.email && errors.email ? { borderColor: red } : undefined}
              />
              {touched.email && errors.email && <ErrorText>{errors.email}</ErrorText>}
            </Field>
            <Field>
              <Label>Телефон</Label>
              <CustomInput
                type="tel"
                placeholder="Телефон"
                value={manager.phone}
                onChange={(e) => setManager({ ...manager, phone: formatPhone(e.target.value) })}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                required
                style={touched.phone && errors.phone ? { borderColor: red } : undefined}
              />
              {touched.phone && errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            </Field>
          </InlineRow>

          <InlineRow>
            <Field>
              <Label>Начало смены</Label>
              <CustomInput
                type="time"
                value={manager.shift?.startShift || ''}
                onChange={(e) =>
                  setManager((prev) => ({
                    ...prev,
                    shift: { ...prev.shift, startShift: e.target.value },
                  }))
                }
                onBlur={() => setTouched((t) => ({ ...t, shiftStart: true }))}
                required
                style={touched.shiftStart && errors.shiftStart ? { borderColor: red } : undefined}
              />
              {touched.shiftStart && errors.shiftStart && (
                <ErrorText>{errors.shiftStart}</ErrorText>
              )}
            </Field>
            <Field>
              <Label>Конец смены</Label>
              <CustomInput
                type="time"
                value={manager.shift?.endShift || ''}
                onChange={(e) =>
                  setManager((prev) => ({
                    ...prev,
                    shift: { ...prev.shift, endShift: e.target.value },
                  }))
                }
                onBlur={() => setTouched((t) => ({ ...t, shiftEnd: true }))}
                required
                style={touched.shiftEnd && errors.shiftEnd ? { borderColor: red } : undefined}
              />
              {touched.shiftEnd && errors.shiftEnd && <ErrorText>{errors.shiftEnd}</ErrorText>}
            </Field>
          </InlineRow>

          <Field>
            <Label>Статус</Label>
            <CustomSelect
              value={manager.status}
              onChange={(val) => setManager({ ...manager, status: val })}
              options={statusOptions}
            />
          </Field>
        </>
      )}
    </CustomModal>
  );
};

export default ManagerModal;
