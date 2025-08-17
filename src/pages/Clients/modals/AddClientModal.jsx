import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomCheckbox from '../../../customs/CustomCheckbox';
import CustomInput from '../../../customs/CustomInput';
import CustomSelect from '../../../customs/CustomSelect';
import { formatPhone } from '../../../helpers/formatPhone';
import { createClient, fetchClients } from '../../../store/clientsSlice';
import {
  BranchesScrollContainer,
  ClientsModal,
  ClientsModalActions,
  ClientsModalButtonPrimary,
  ClientsModalButtonSecondary,
  ClientsModalFormGroup,
  ClientsModalOverlay,
  ClientsModalTitle,
  FooterCardDescription,
  Label,
} from '../styles';

const AddClientModal = ({ open, onClose, onCreated }) => {
  const dispatch = useDispatch();

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
  const [mode, setMode] = useState('branches'); // 'branches' | 'network'
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ''), [form.phone]);
  const isEmailValid = useMemo(
    () => (form.email ? /^\S+@\S+\.\S+$/.test(form.email) : false),
    [form.email],
  );

  const canSubmit = useMemo(() => {
    const baseOk =
      form.name && form.surname && phoneDigits.length === 11 && isEmailValid && form.birthday;
    const scopeOk =
      (mode === 'branches' && selectedBranches.length > 0) ||
      (mode === 'network' && selectedNetwork !== null);
    return baseOk && scopeOk;
  }, [form, phoneDigits, isEmailValid, mode, selectedBranches, selectedNetwork]);

  const handleAddClient = useCallback(() => {
    const payload = {
      ...form,
      phone: phoneDigits,
      organization_id: orgId,
      branch_ids: mode === 'branches' ? selectedBranches : undefined,
      network_id: mode === 'network' ? selectedNetwork : undefined,
    };

    dispatch(createClient(payload))
      .unwrap()
      .then((res) => {
        onCreated?.(res.id);
        dispatch(fetchClients());
        onClose?.();
        // reset
        setForm({ surname: '', name: '', phone: '', email: '', birthday: '' });
        setSelectedBranches([]);
        setSelectedNetwork(null);
        setMode('branches');
      });
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
  ]);

  if (!open) return null;

  return (
    <ClientsModalOverlay onClick={onClose}>
      <ClientsModal onClick={(e) => e.stopPropagation()}>
        <ClientsModalTitle>Добавить клиента</ClientsModalTitle>

        <ClientsModalFormGroup>
          <CustomInput
            placeholder="Фамилия"
            value={form.surname}
            onChange={(e) => setForm((p) => ({ ...p, surname: e.target.value }))}
          />
        </ClientsModalFormGroup>

        <ClientsModalFormGroup>
          <CustomInput
            placeholder="Имя"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </ClientsModalFormGroup>

        <ClientsModalFormGroup>
          <CustomInput
            placeholder="Телефон"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: formatPhone(e.target.value) }))}
          />
        </ClientsModalFormGroup>

        <ClientsModalFormGroup>
          <CustomInput
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </ClientsModalFormGroup>

        <ClientsModalFormGroup>
          <Label>Дата рождения</Label>
          <CustomInput
            type="date"
            value={form.birthday}
            onChange={(e) => setForm((p) => ({ ...p, birthday: e.target.value }))}
          />
        </ClientsModalFormGroup>

        <ClientsModalFormGroup style={{ display: 'flex', gap: 20 }}>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === 'branches'}
              onChange={() => {
                setMode('branches');
                setSelectedNetwork(null);
              }}
            />{' '}
            По точкам
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === 'network'}
              onChange={() => {
                setMode('network');
                setSelectedBranches([]);
              }}
            />{' '}
            По сети
          </label>
        </ClientsModalFormGroup>

        {mode === 'branches' && (
          <ClientsModalFormGroup>
            <Label>Точки продаж</Label>
            <BranchesScrollContainer>
              {branches.map((br) => (
                <label key={br.id} style={{ display: 'block', marginBottom: 4 }}>
                  <CustomCheckbox
                    checked={selectedBranches.includes(br.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBranches((prev) => [...prev, br.id]);
                      } else {
                        setSelectedBranches((prev) => prev.filter((id) => id !== br.id));
                      }
                    }}
                  />{' '}
                  {br.name}
                </label>
              ))}
              {branches.length === 0 && (
                <FooterCardDescription>Нет доступных точек.</FooterCardDescription>
              )}
            </BranchesScrollContainer>
          </ClientsModalFormGroup>
        )}

        {mode === 'network' && (
          <ClientsModalFormGroup>
            <Label>Сеть</Label>
            <CustomSelect
              value={selectedNetwork}
              onChange={setSelectedNetwork}
              options={networks.map((n) => ({ value: n.id, label: n.name }))}
              placeholder="Выберите сеть"
            />
          </ClientsModalFormGroup>
        )}

        <ClientsModalActions>
          <ClientsModalButtonPrimary onClick={handleAddClient} disabled={!canSubmit}>
            Добавить клиента
          </ClientsModalButtonPrimary>
          <ClientsModalButtonSecondary onClick={onClose}>Отменить</ClientsModalButtonSecondary>
        </ClientsModalActions>
      </ClientsModal>
    </ClientsModalOverlay>
  );
};

export default AddClientModal;
