import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Check, RefreshCw, Copy } from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import CustomModal from '../../customs/CustomModal';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';

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

const CardInfoBlock = styled.div`
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
    background: #1f1e1f;
    color: #fff;
    border: none;
    &:hover { background: #333; }
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #1f1e1f;
  margin-bottom: 12px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.8;

  code {
    background: #e5e7eb;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    color: #1f1e1f;
  }

  div {
    margin-bottom: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  transition: all 0.15s;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmText = styled.p`
  font-size: 15px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [integration, setIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [restaurantCode, setRestaurantCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
      return;
    }

    const fetchIntegration = async () => {
      try {
        const res = await axiosInstance.get(`/rkeeper/integration/card/${cardId}`);
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
  }, [cardId]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.post('/rkeeper/integration', {
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
      const res = await axiosInstance.put(`/rkeeper/integration/card/${cardId}`, {
        restaurant_code: restaurantCode || null,
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
      const res = await axiosInstance.put(`/rkeeper/integration/card/${cardId}`, {
        is_active: !integration.is_active,
      });
      setIntegration(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = () => {
    setShowConfirm(true);
  };

  const confirmRegenerateKey = async () => {
    setShowConfirm(false);
    setSaving(true);
    try {
      const res = await axiosInstance.post(`/rkeeper/integration/card/${cardId}/regenerate-key`);
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

  const apiBaseUrl = window.location.origin;

  const renderModal = () => {
    const modalTitle = integration ? 'Настройки R_keeper' : 'Подключить R_keeper';

    const modalActions = !integration ? (
      <CustomMainButton onClick={handleCreate} disabled={saving} style={{ width: '100%' }}>
        {saving ? 'Создание...' : 'Активировать интеграцию'}
      </CustomMainButton>
    ) : (
      <ActionButtons>
        <SecondaryButton onClick={handleToggleActive} disabled={saving}>
          {integration.is_active ? 'Отключить' : 'Включить'}
        </SecondaryButton>
        <CustomMainButton onClick={handleUpdate} disabled={saving} style={{ flex: 1 }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </CustomMainButton>
      </ActionButtons>
    );

    return (
      <CustomModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        actions={modalActions}
        maxWidth={550}
      >
        <ModalContent>
          {!integration ? (
            <>
              <InfoBox>
                <InfoTitle>Как это работает?</InfoTitle>
                <InfoText>
                  После активации вы получите API-ключ для настройки r_keeper. Касса будет
                  автоматически начислять и списывать баллы при оплате.
                </InfoText>
              </InfoBox>

              <FieldGroup>
                <Label>Код ресторана (опционально)</Label>
                <CustomInput
                  value={restaurantCode}
                  onChange={(e) => setRestaurantCode(e.target.value)}
                  placeholder="Например: KAFE001"
                />
              </FieldGroup>
            </>
          ) : (
            <>
              <FieldGroup>
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
              </FieldGroup>

              <FieldGroup>
                <Label>API-ключ</Label>
                <ApiKeyBox>
                  <CustomInput value={integration.api_key} readOnly style={{ flex: 1 }} />
                  <IconBtn onClick={handleCopyKey} title="Копировать">
                    {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                  </IconBtn>
                  <IconBtn onClick={handleRegenerateKey} title="Сгенерировать новый" disabled={saving}>
                    <RefreshCw size={18} />
                  </IconBtn>
                </ApiKeyBox>
              </FieldGroup>

              <FieldGroup>
                <Label>Код ресторана</Label>
                <CustomInput
                  value={restaurantCode}
                  onChange={(e) => setRestaurantCode(e.target.value)}
                  placeholder="Например: KAFE001"
                />
              </FieldGroup>

              <InfoBox>
                <InfoTitle>Как настроить интеграцию с r_keeper</InfoTitle>
                <InfoText>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Шаг 1:</strong> Откройте менеджерскую станцию r_keeper и перейдите в раздел <em>Сервис → Дисконтные карты → FarCards-Http</em>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Шаг 2:</strong> Укажите параметры подключения:
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>Адрес сервера:</strong> <code>{apiBaseUrl}</code></li>
                      <li><strong>Порт:</strong> <code>443</code></li>
                      <li><strong>Использовать HTTPS:</strong> Да</li>
                    </ul>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Шаг 3:</strong> В настройках авторизации укажите заголовок:
                    <div style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: '6px', marginTop: '4px', fontFamily: 'monospace', fontSize: '13px' }}>
                      X-API-Key: {integration.api_key}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Шаг 4:</strong> Настройте эндпоинты:
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>Информация о карте:</strong> <code>POST {apiBaseUrl}/rkeeper/card/info</code></li>
                      <li><strong>Начисление/списание баллов:</strong> <code>POST {apiBaseUrl}/rkeeper/transaction</code></li>
                      <li><strong>Проверка баланса:</strong> <code>POST {apiBaseUrl}/rkeeper/balance</code></li>
                    </ul>
                  </div>
                  <div>
                    <strong>Шаг 5:</strong> Сохраните настройки и перезапустите кассовую станцию для применения изменений.
                  </div>
                </InfoText>
              </InfoBox>
              
              <InfoBox style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
                <InfoTitle style={{ color: '#b45309' }}>Как это работает?</InfoTitle>
                <InfoText style={{ color: '#92400e' }}>
                  При оплате заказа касса автоматически отправит запрос с номером карты клиента. 
                  Система начислит или спишет баллы согласно настройкам карты лояльности. 
                  Клиент может назвать номер карты или показать QR-код из кошелька.
                </InfoText>
              </InfoBox>
            </>
          )}
        </ModalContent>
      </CustomModal>
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
                <CardInfoBlock>
                  <CardName>{item.name}</CardName>
                  <CardDescription>{item.description}</CardDescription>
                </CardInfoBlock>
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

      <CustomModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Подтверждение"
        maxWidth={400}
        actions={
          <ActionButtons>
            <SecondaryButton onClick={() => setShowConfirm(false)}>
              Отмена
            </SecondaryButton>
            <CustomMainButton onClick={confirmRegenerateKey} style={{ flex: 1 }}>
              Подтвердить
            </CustomMainButton>
          </ActionButtons>
        }
      >
        <ConfirmText>
          Вы уверены? Старый API-ключ перестанет работать.
        </ConfirmText>
      </CustomModal>
    </Page>
  );
};

export default CardIntegrations;

