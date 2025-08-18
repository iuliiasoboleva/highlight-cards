import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BranchCheckboxList from '../../../components/BranchCheckboxList';
import { useToast } from '../../../components/Toast';
import CustomInput from '../../../customs/CustomInput';
import CustomModal from '../../../customs/CustomModal';
import { CustomRadioGroup } from '../../../customs/CustomRadio';
import CustomSelect from '../../../customs/CustomSelect';
import { formatPhone } from '../../../helpers/formatPhone';
import { createClient, fetchClients } from '../../../store/clientsSlice';
import { ClientsModalFormGroup, ErrorText, Label } from '../styles';

const NAME_RE = /^[A-Za-zА-Яа-яЁё\s-]+$/;

const AddClientModal = ({ open, onClose, onCreated }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const orgId = useSelector((s) => s.user.organization_id);
  const branches = useSelector((s) => s.locations.list);
  const networks = useSelector((s) => s.networks.list);

  const [form, setForm] = useState({
    surname: '',
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });
  const [mode, setMode] = useState('branches');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [touched, setTouched] = useState({
    surname: false,
    name: false,
    phone: false,
    email: false,
    scope: false,
  });

  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ''), [form.phone]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.surname.trim()) e.surname = 'Укажите фамилию';
    else if (!NAME_RE.test(form.surname.trim())) e.surname = 'Только буквы, пробел и дефис';

    if (!form.name.trim()) e.name = 'Укажите имя';
    else if (!NAME_RE.test(form.name.trim())) e.name = 'Только буквы, пробел и дефис';

    if (phoneDigits.length !== 11) e.phone = 'Телефон должен содержать 11 цифр';

    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      e.email = 'Некорректный email';
    }

    if (mode === 'branches') {
      if (selectedBranches.length === 0) e.scope = 'Выберите хотя бы одну точку продаж';
    } else {
      if (selectedNetwork === null) e.scope = 'Выберите сеть';
    }

    return e;
  }, [form, phoneDigits, mode, selectedBranches, selectedNetwork]);

  const isValid = Object.keys(errors).length === 0;

  const safeGetId = (res) => res?.id ?? res?.data?.id ?? res?.payload?.id ?? Date.now();

  const handleAddClient = useCallback(async () => {
    if (!isValid) {
      setTouched({
        surname: true,
        name: true,
        phone: true,
        email: true,
        scope: true,
      });
      toast.error('Проверьте заполнение обязательных полей');
      return;
    }

    const payload = {
      ...form,
      phone: phoneDigits,
      organization_id: orgId,
      branch_ids: mode === 'branches' ? selectedBranches : undefined,
      network_id: mode === 'network' ? selectedNetwork : undefined,
    };

    try {
      const res = await dispatch(createClient(payload)).unwrap();

      const newId = safeGetId(res);
      toast.success('Клиент добавлен');
      onCreated?.(newId);

      await dispatch(fetchClients());
      onClose?.();

      // reset
      setForm({ surname: '', name: '', phone: '', email: '', birthday: '' });
      setSelectedBranches([]);
      setSelectedNetwork(null);
      setMode('branches');
      setTouched({ surname: false, name: false, phone: false, email: false, scope: false });
    } catch (err) {
      const msg =
        typeof err === 'string' ? err : err?.message || err?.error || 'Не удалось создать клиента';
      toast.error(msg);
    }
  }, [
    dispatch,
    form,
    phoneDigits,
    orgId,
    mode,
    selectedBranches,
    selectedNetwork,
    onClose,
    onCreated,
    isValid,
    toast,
  ]);

  if (!open) return null;

  const red = '#c14857';

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Добавить клиента"
      actions={
        <>
          <CustomModal.PrimaryButton onClick={handleAddClient} disabled={!isValid}>
            Добавить клиента
          </CustomModal.PrimaryButton>
          <CustomModal.SecondaryButton onClick={onClose}>Отменить</CustomModal.SecondaryButton>
        </>
      }
    >
      <ClientsModalFormGroup>
        <CustomInput
          placeholder="Фамилия"
          value={form.surname}
          onChange={(e) => setForm((p) => ({ ...p, surname: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, surname: true }))}
          required
          style={touched.surname && errors.surname ? { borderColor: red } : undefined}
        />
        {touched.surname && errors.surname && <ErrorText>{errors.surname}</ErrorText>}
      </ClientsModalFormGroup>

      <ClientsModalFormGroup>
        <CustomInput
          placeholder="Имя"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          required
          style={touched.name && errors.name ? { borderColor: red } : undefined}
        />
        {touched.name && errors.name && <ErrorText>{errors.name}</ErrorText>}
      </ClientsModalFormGroup>

      <ClientsModalFormGroup>
        <CustomInput
          placeholder="Телефон"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: formatPhone(e.target.value) }))}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          required
          style={touched.phone && errors.phone ? { borderColor: red } : undefined}
        />
        {touched.phone && errors.phone && <ErrorText>{errors.phone}</ErrorText>}
      </ClientsModalFormGroup>

      <ClientsModalFormGroup>
        <CustomInput
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          style={touched.email && errors.email ? { borderColor: red } : undefined}
        />
        {touched.email && errors.email && <ErrorText>{errors.email}</ErrorText>}
      </ClientsModalFormGroup>

      <ClientsModalFormGroup>
        <Label>Дата рождения</Label>
        <CustomInput
          type="date"
          value={form.birthday}
          onChange={(e) => setForm((p) => ({ ...p, birthday: e.target.value }))}
        />
      </ClientsModalFormGroup>

      <ClientsModalFormGroup>
        <CustomRadioGroup
          name="mode"
          selected={mode}
          onChange={(val) => {
            setMode(val);
            setTouched((t) => ({ ...t, scope: true }));
            if (val === 'branches') {
              setSelectedNetwork(null);
            } else {
              setSelectedBranches([]);
            }
          }}
          options={[
            { value: 'branches', label: 'По точкам' },
            { value: 'network', label: 'По сети' },
          ]}
        />
      </ClientsModalFormGroup>

      {mode === 'branches' ? (
        <ClientsModalFormGroup>
          <Label>Точки продаж</Label>
          <BranchCheckboxList
            items={branches}
            selected={selectedBranches}
            onChange={setSelectedBranches}
            onTouch={() => setTouched((t) => ({ ...t, scope: true }))}
            emptyText="Нет доступных точек."
            maxHeight={180}
          />
          {touched.scope && errors.scope && <ErrorText>{errors.scope}</ErrorText>}
        </ClientsModalFormGroup>
      ) : (
        <ClientsModalFormGroup>
          <Label>Сеть</Label>
          <CustomSelect
            value={selectedNetwork}
            onChange={(val) => {
              setSelectedNetwork(val);
              setTouched((t) => ({ ...t, scope: true }));
            }}
            options={networks.map((n) => ({ value: n.id, label: n.name }))}
            placeholder="Выберите сеть"
          />
          {touched.scope && errors.scope && <ErrorText>{errors.scope}</ErrorText>}
        </ClientsModalFormGroup>
      )}
    </CustomModal>
  );
};

export default AddClientModal;
