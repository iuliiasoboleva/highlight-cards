import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance';
import BASE_URL from '../../config';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f1e1f;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #bf4756;
  }

  &:read-only {
    background: #f9fafb;
    cursor: default;
  }
`;

const ApiKeyBox = styled.div`
  display: flex;
  gap: 8px;
`;

const CopyButton = styled.button`
  padding: 12px 16px;
  background: #bf4756;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #a33d4a;
  }

  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  ${({ $primary }) =>
    $primary
      ? `
    background: #bf4756;
    color: #fff;
    border: none;
    &:hover { background: #a33d4a; }
  `
      : `
    background: #fff;
    color: #374151;
    border: 1px solid #e5e7eb;
    &:hover { background: #f9fafb; }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  ${({ $active }) =>
    $active
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : `
    background: #fef2f2;
    color: #991b1b;
  `}
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 8px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #0c4a6e;
  line-height: 1.5;

  code {
    background: #e0f2fe;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
`;

const EndpointList = styled.div`
  font-size: 13px;
  color: #374151;
  margin-top: 16px;

  div {
    margin-bottom: 8px;
  }

  strong {
    color: #1f1e1f;
  }
`;

const RKeeperModal = ({ onClose }) => {
  const user = useSelector((state) => state.user.user);
  const organizationId = user?.organization_id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [integration, setIntegration] = useState(null);
  const [restaurantCode, setRestaurantCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!organizationId) return;

    const fetchIntegration = async () => {
      try {
        const res = await axiosInstance.get(`/rkeeper/integration/${organizationId}`);
        setIntegration(res.data);
        setRestaurantCode(res.data.restaurant_code || '');
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching r_keeper integration:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIntegration();
  }, [organizationId]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.post('/rkeeper/integration', {
        organization_id: organizationId,
        restaurant_code: restaurantCode || null,
      });
      setIntegration(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при создании интеграции');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/rkeeper/integration/${organizationId}`, {
        restaurant_code: restaurantCode || null,
        is_active: integration.is_active,
      });
      setIntegration(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при обновлении');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/rkeeper/integration/${organizationId}`, {
        is_active: !integration.is_active,
      });
      setIntegration(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при изменении статуса');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (!window.confirm('Вы уверены? Старый API-ключ перестанет работать.')) return;

    setSaving(true);
    try {
      const res = await axiosInstance.post(`/rkeeper/integration/${organizationId}/regenerate-key`);
      setIntegration(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при генерации ключа');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyKey = () => {
    if (integration?.api_key) {
      navigator.clipboard.writeText(integration.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const apiBaseUrl = BASE_URL.replace('/api', '');

  if (loading) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Title>Загрузка...</Title>
        </Modal>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Интеграция с R_keeper</Title>
        <Subtitle>
          Подключите вашу кассовую систему r_keeper для автоматического начисления и списания баллов
        </Subtitle>

        {!integration ? (
          <>
            <InfoBox>
              <InfoTitle>Как это работает?</InfoTitle>
              <InfoText>
                После активации интеграции вы получите API-ключ, который нужно указать в настройках
                r_keeper. Касса будет автоматически отправлять запросы при оплате для начисления и
                списания баллов.
              </InfoText>
            </InfoBox>

            <Section>
              <Label>Код ресторана (опционально)</Label>
              <Input
                type="text"
                value={restaurantCode}
                onChange={(e) => setRestaurantCode(e.target.value)}
                placeholder="Например: REST001"
              />
            </Section>

            <ButtonRow>
              <Button onClick={onClose}>Отмена</Button>
              <Button $primary onClick={handleCreate} disabled={saving}>
                {saving ? 'Создание...' : 'Активировать интеграцию'}
              </Button>
            </ButtonRow>
          </>
        ) : (
          <>
            <Section>
              <Label>
                Статус:{' '}
                <StatusBadge $active={integration.is_active}>
                  {integration.is_active ? 'Активна' : 'Отключена'}
                </StatusBadge>
              </Label>
            </Section>

            <Section>
              <Label>API-ключ</Label>
              <ApiKeyBox>
                <Input type="text" value={integration.api_key} readOnly />
                <CopyButton onClick={handleCopyKey}>{copied ? '✓ Скопировано' : 'Копировать'}</CopyButton>
              </ApiKeyBox>
            </Section>

            <Section>
              <Label>Код ресторана</Label>
              <Input
                type="text"
                value={restaurantCode}
                onChange={(e) => setRestaurantCode(e.target.value)}
                placeholder="Например: REST001"
              />
            </Section>

            <InfoBox>
              <InfoTitle>Настройка r_keeper</InfoTitle>
              <InfoText>
                В настройках FarCards-Http укажите следующие параметры:
              </InfoText>
              <EndpointList>
                <div>
                  <strong>URL сервера:</strong> <code>{apiBaseUrl}</code>
                </div>
                <div>
                  <strong>Заголовок авторизации:</strong> <code>X-API-Key: {integration.api_key}</code>
                </div>
                <div>
                  <strong>Получение информации о карте:</strong> <code>POST /rkeeper/card/info</code>
                </div>
                <div>
                  <strong>Начисление/списание:</strong> <code>POST /rkeeper/transaction</code>
                </div>
                <div>
                  <strong>Проверка баланса:</strong> <code>POST /rkeeper/balance</code>
                </div>
              </EndpointList>
            </InfoBox>

            <ButtonRow>
              <Button onClick={handleToggleActive} disabled={saving}>
                {integration.is_active ? 'Отключить' : 'Включить'}
              </Button>
              <Button onClick={handleRegenerateKey} disabled={saving}>
                Новый ключ
              </Button>
              <Button onClick={onClose}>Закрыть</Button>
              <Button $primary onClick={handleUpdate} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </ButtonRow>
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default RKeeperModal;

