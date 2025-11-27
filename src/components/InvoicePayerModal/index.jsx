import React, { useEffect, useMemo, useState } from 'react';

import axiosInstance from '../../axiosInstance';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import CustomModal from '../../customs/CustomModal';
import { formatPhone } from '../../helpers/formatPhone';
import InnSuggestInput from '../InnSuggestInput';

const initialState = {
  inn: '',
  name: '',
  kpp: '',
  legal_address: '',
  checking_account: '',
  bik: '',
  bank_name: '',
  correspondent_account: '',
  postal_address: '',
  phone: '',
  signatory: '',
};

const InvoicePayerModal = ({ open, onClose, organizationId, onSaved }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!open || !organizationId) return;
    setLoading(true);
    setIsGenerating(false);
    axiosInstance
      .get('/billing/payer', { params: { organization_id: organizationId } })
      .then((res) => {
        if (res.data) {
          const next = { ...res.data };
          if (next.phone) next.phone = formatPhone(String(next.phone));
          setForm((s) => ({ ...s, ...next }));
        }
      })
      .finally(() => setLoading(false));
  }, [open, organizationId]);

  const disabled = useMemo(() => {
    const innStr = String(form.inn || '').trim();
    const innOk = /^(?:\d{10}|\d{12})$/.test(innStr);
    const isIp = innStr.length === 12;
    const bikOk = /^\d{9}$/.test(String(form.bik || ''));
    const rsOk = /^\d{20}$/.test(String(form.checking_account || ''));
    const kppOk = isIp ? true : /^\d{9}$/.test(String(form.kpp || ''));
    const phoneOk = (String(form.phone || '').replace(/\D/g, '') || '').length === 11;
    const requiredFilled =
      form.name &&
      form.legal_address &&
      form.bank_name &&
      form.correspondent_account &&
      form.postal_address &&
      phoneOk &&
      form.signatory &&
      kppOk;
    return !(innOk && bikOk && rsOk && requiredFilled);
  }, [form]);

  const { innError, bikError, rsError, kppError, phoneError } = useMemo(() => {
    const innStr = String(form.inn || '').trim();
    const isIp = innStr.length === 12;
    return {
      innError: !!form.inn && !/^(?:\d{10}|\d{12})$/.test(innStr),
      bikError: !!form.bik && !/^\d{9}$/.test(String(form.bik || '')),
      rsError: !!form.checking_account && !/^\d{20}$/.test(String(form.checking_account || '')),
      kppError: !isIp && !!form.kpp && !/^\d{9}$/.test(String(form.kpp || '')),
      phoneError: !!form.phone && String(form.phone).replace(/\D/g, '').length !== 11,
    };
  }, [form]);

  const setField = (k) => (v) =>
    setForm((s) => ({ ...s, [k]: typeof v === 'string' ? v : v?.target?.value || '' }));

  const fetchByInn = async (inn) => {
    try {
      const res = await axiosInstance.get('/company', { params: { inn } });
      const d = res.data || {};
      setForm((s) => ({
        ...s,
        inn: d.inn || inn,
        name: d.name || s.name,
        kpp: d.kpp || s.kpp,
        legal_address: d.address || s.legal_address,
        postal_address: d.address || s.postal_address,
      }));
    } catch {}
  };

  const fetchBankByBik = async (bik) => {
    try {
      const res = await axiosInstance.get('/billing/bank', { params: { bik } });
      setForm((s) => ({
        ...s,
        bik,
        bank_name: res.data?.name || s.bank_name,
        correspondent_account: res.data?.correspondent_account || s.correspondent_account,
      }));
    } catch {}
  };

  const handleCreate = async () => {
    setLoading(true);
    setIsGenerating(true);
    try {
      await axiosInstance.post('/billing/payer', form, {
        params: { organization_id: organizationId },
      });
      onSaved?.(form);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsGenerating(false);
    onClose?.();
  };

  if (isGenerating) {
    return (
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Формирование счёта"
        maxWidth={420}
        actions={
          <button
            onClick={handleClose}
            style={{
              backgroundColor: '#c9363f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            ОК
          </button>
        }
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#c9363f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px',
              color: 'white',
            }}
          >
            📄
          </div>
          <p style={{ margin: '0 0 10px', fontWeight: '500', fontSize: '16px' }}>
            Ваш счёт формируется
          </p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            Как только он будет сформирован,<br />произойдёт автоматическое скачивание
          </p>
        </div>
      </CustomModal>
    );
  }

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Данные плательщика"
      maxWidth={640}
      actions={
        <CustomMainButton onClick={handleCreate} disabled={disabled || loading} $maxWidth={200}>
          Создать счёт
        </CustomMainButton>
      }
    >
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div className="label">ИНН</div>
          <InnSuggestInput
            value={form.inn}
            onChange={(v) => setField('inn')(v)}
            onSelect={(item) => {
              const innVal = item?.data?.inn || '';
              setForm((s) => ({ ...s, inn: innVal }));
              fetchByInn(innVal);
            }}
            inputClass="custom-input"
          />
          {innError && (
            <div style={{ color: '#c9353f', fontSize: 12, marginTop: 4 }}>
              ИНН должен состоять из 10 или 12 цифр
            </div>
          )}
        </div>
        <div>
          <div className="label">ФИО для подписи</div>
          <CustomInput
            value={form.signatory}
            onChange={setField('signatory')}
            className="custom-input"
          />
        </div>
        <div>
          <div className="label">Название организации</div>
          <CustomInput value={form.name} onChange={setField('name')} className="custom-input" />
        </div>
        <div>
          <div className="label">КПП</div>
          <CustomInput
            value={form.kpp}
            onChange={setField('kpp')}
            className="custom-input"
            placeholder="для ИП можно оставить пусто"
            maxLength={9}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {kppError && (
            <div style={{ color: '#c9353f', fontSize: 12, marginTop: 4 }}>
              КПП должен содержать 9 цифр
            </div>
          )}
        </div>
        <div>
          <div className="label">Юридический адрес</div>
          <CustomInput
            value={form.legal_address}
            onChange={setField('legal_address')}
            className="custom-input"
          />
        </div>
        <div>
          <div className="label">р/с</div>
          <CustomInput
            value={form.checking_account}
            onChange={setField('checking_account')}
            className="custom-input"
            maxLength={20}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {rsError && (
            <div style={{ color: '#c9353f', fontSize: 12, marginTop: 4 }}>
              р/с должен содержать ровно 20 цифр
            </div>
          )}
        </div>
        <div>
          <div className="label">БИК</div>
          <CustomInput
            value={form.bik}
            onChange={(e) => {
              const v = e.target.value;
              setForm((s) => ({ ...s, bik: v }));
              if (v && v.length >= 9) fetchBankByBik(v);
            }}
            className="custom-input"
            maxLength={9}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {bikError && (
            <div style={{ color: '#c9353f', fontSize: 12, marginTop: 4 }}>
              БИК должен содержать 9 цифр
            </div>
          )}
        </div>
        <div>
          <div className="label">Банк</div>
          <CustomInput
            value={form.bank_name}
            onChange={setField('bank_name')}
            className="custom-input"
          />
        </div>
        <div>
          <div className="label">к/с</div>
          <CustomInput
            value={form.correspondent_account}
            onChange={setField('correspondent_account')}
            className="custom-input"
            maxLength={20}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div>
          <div className="label">Почтовый адрес</div>
          <CustomInput
            value={form.postal_address}
            onChange={setField('postal_address')}
            className="custom-input"
          />
        </div>
        <div>
          <div className="label">Телефон</div>
          <CustomInput
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: formatPhone(e.target.value) }))}
            className="custom-input"
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
          />
          {phoneError && (
            <div style={{ color: '#c9353f', fontSize: 12, marginTop: 4 }}>
              Введите номер в формате +7 (___) ___-__-__
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default InvoicePayerModal;
