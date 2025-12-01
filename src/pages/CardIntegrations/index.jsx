import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Check, X, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import BASE_URL from '../../config';

import rkeeperIcon from '../../assets/rkeeper.png';
import yclientsIcon from '../../assets/yclients.png';
import oneCIcon from '../../assets/1c.png';
import iikoIcon from '../../assets/iiko.png';

const Page = styled.div`
  padding: 24px;
  max-width: 1200px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f1e1f;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid ${({ $active }) => ($active ? '#10b981' : '#e5e7eb')};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  ${({ $disabled }) =>
    $disabled
      ? `
    opacity: 0.5;
    cursor: not-allowed;
  `
      : `
    &:hover {
      border-color: #bf4756;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #1f1e1f;
`;

const CardDescription = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
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
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 16px;

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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
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

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f1e1f;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
`;

const Section = styled.div`
  margin-bottom: 20px;
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

const IconBtn = styled.button`
  padding: 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e7eb;
  }
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 8px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #0c4a6e;
  line-height: 1.6;

  code {
    background: #e0f2fe;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
  }

  div {
    margin-bottom: 6px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
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

const INTEGRATIONS = [
  {
    key: 'r_keeper',
    name: 'R_keeper',
    logo: rkeeperIcon,
    description: 'Интеграция с кассами r_keeper',
    enabled: true,
  },
  {
    key: 'yclients',
    name: 'YClients',
    logo: yclientsIcon,
    description: 'Интеграция с CRM YClients',
    enabled: false,
  },
  {
    key: '1c',
    name: '1C',
    logo: oneCIcon,
    description: 'Интеграция с системой 1C',
    enabled: false,
  },
  {
    key: 'iiko',
    name: 'iiko',
    logo: iikoIcon,
    description: 'Интеграция с кассами iiko',
    enabled: false,
  },
];

const CardIntegrations = () => {
  const { id: cardId } = useParams();
  const organizationId = useSelector((state) => state.user.organization_id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [integration, setIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [restaurantCode, setRestaurantCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchIntegration = async () => {
      try {
        const res = await axiosInstance.get(`/rkeeper/integration/${organizationId}`);
        setIntegration(res.data);
        setRestaurantCode(res.data.restaurant_code || '');
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching integration:', err);
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
        card_id: cardId,
        restaurant_code: restaurantCode || null,
      });
      setIntegration(res.data);
      setShowModal(false);
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
        card_id: cardId,
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
      alert(err.response?.data?.detail || 'Ошибка');
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
      alert(err.response?.data?.detail || 'Ошибка');
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

  const renderModal = () => {
    if (!showModal) return null;

    return createPortal(
      <Overlay onClick={() => setShowModal(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalTitle>
            {integration ? 'Настройки R_keeper' : 'Подключить R_keeper'}
          </ModalTitle>
          <ModalSubtitle>
            {integration
              ? 'Управление интеграцией с кассовой системой'
              : 'Подключите кассы r_keeper для автоматического начисления баллов'}
          </ModalSubtitle>

          {!integration ? (
            <>
              <InfoBox>
                <InfoTitle>Как это работает?</InfoTitle>
                <InfoText>
                  После активации вы получите API-ключ для настройки r_keeper. Касса будет
                  автоматически начислять и списывать баллы при оплате.
                </InfoText>
              </InfoBox>

              <Section>
                <Label>Код ресторана (опционально)</Label>
                <Input
                  type="text"
                  value={restaurantCode}
                  onChange={(e) => setRestaurantCode(e.target.value)}
                  placeholder="REST001"
                />
              </Section>

              <ButtonRow>
                <ModalButton onClick={() => setShowModal(false)}>Отмена</ModalButton>
                <ModalButton $primary onClick={handleCreate} disabled={saving}>
                  {saving ? 'Создание...' : 'Активировать'}
                </ModalButton>
              </ButtonRow>
            </>
          ) : (
            <>
              <Section>
                <Label>
                  Статус:{' '}
                  <StatusBadge $active={integration.is_active}>
                    {integration.is_active ? (
                      <>
                        <Check size={12} /> Активна
                      </>
                    ) : (
                      'Отключена'
                    )}
                  </StatusBadge>
                </Label>
              </Section>

              <Section>
                <Label>API-ключ</Label>
                <ApiKeyBox>
                  <Input type="text" value={integration.api_key} readOnly style={{ flex: 1 }} />
                  <IconBtn onClick={handleCopyKey} title="Копировать">
                    {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                  </IconBtn>
                  <IconBtn onClick={handleRegenerateKey} title="Сгенерировать новый" disabled={saving}>
                    <RefreshCw size={18} />
                  </IconBtn>
                </ApiKeyBox>
              </Section>

              <Section>
                <Label>Код ресторана</Label>
                <Input
                  type="text"
                  value={restaurantCode}
                  onChange={(e) => setRestaurantCode(e.target.value)}
                  placeholder="REST001"
                />
              </Section>

              <InfoBox>
                <InfoTitle>Настройка r_keeper</InfoTitle>
                <InfoText>
                  <div>
                    <strong>URL сервера:</strong> <code>{apiBaseUrl}</code>
                  </div>
                  <div>
                    <strong>Заголовок:</strong> <code>X-API-Key: {integration.api_key}</code>
                  </div>
                  <div>
                    <strong>Информация о карте:</strong> <code>POST /rkeeper/card/info</code>
                  </div>
                  <div>
                    <strong>Транзакции:</strong> <code>POST /rkeeper/transaction</code>
                  </div>
                  <div>
                    <strong>Баланс:</strong> <code>POST /rkeeper/balance</code>
                  </div>
                </InfoText>
              </InfoBox>

              <ButtonRow>
                <ModalButton onClick={handleToggleActive} disabled={saving}>
                  {integration.is_active ? 'Отключить' : 'Включить'}
                </ModalButton>
                <ModalButton onClick={() => setShowModal(false)}>Закрыть</ModalButton>
                <ModalButton $primary onClick={handleUpdate} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </ModalButton>
              </ButtonRow>
            </>
          )}
        </Modal>
      </Overlay>,
      document.body
    );
  };

  if (loading) {
    return (
      <Page>
        <Title>Интеграции</Title>
        <Subtitle>Загрузка...</Subtitle>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Интеграции</Title>
      <Subtitle>
        Подключите внешние системы для автоматического начисления и списания баллов
      </Subtitle>

      <Grid>
        {INTEGRATIONS.map((item) => {
          const isActive = item.key === 'r_keeper' && integration?.is_active;
          const isConfigured = item.key === 'r_keeper' && integration;

          return (
            <Card key={item.key} $active={isActive} $disabled={!item.enabled}>
              <CardHeader>
                <Logo src={item.logo} alt={item.name} />
                <CardInfo>
                  <CardName>{item.name}</CardName>
                  <CardDescription>{item.description}</CardDescription>
                </CardInfo>
                {isActive && (
                  <StatusBadge $active>
                    <Check size={12} /> Активна
                  </StatusBadge>
                )}
              </CardHeader>

              {item.enabled ? (
                <Button
                  $primary={!isConfigured}
                  onClick={() => setShowModal(true)}
                  disabled={saving}
                >
                  {isConfigured ? 'Настроить' : 'Подключить'}
                </Button>
              ) : (
                <Button disabled>Скоро</Button>
              )}
            </Card>
          );
        })}
      </Grid>

      {renderModal()}
    </Page>
  );
};

export default CardIntegrations;

