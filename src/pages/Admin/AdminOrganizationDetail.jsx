import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import adminAxiosInstance from '../../adminAxiosInstance';

const AdminOrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingNiche, setEditingNiche] = useState(false);
  const [newNiche, setNewNiche] = useState('');

  useEffect(() => {
    fetchOrganizationDetail();
  }, [id]);

  const fetchOrganizationDetail = async () => {
    try {
      setLoading(true);
      const response = await adminAxiosInstance.get(`/admin/users/organizations/${id}`);
      setOrg(response.data);
      setNewNiche(response.data.niche?.niche || '');
    } catch (error) {
      console.error('Ошибка загрузки организации:', error);
      alert('Не удалось загрузить информацию об организации');
      navigate('/admin/organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNiche = async () => {
    try {
      await adminAxiosInstance.patch(`/admin/users/organizations/${id}/niche`, {
        niche: newNiche
      });
      alert('Ниша успешно обновлена');
      setEditingNiche(false);
      fetchOrganizationDetail();
    } catch (error) {
      console.error('Ошибка обновления ниши:', error);
      alert('Не удалось обновить нишу');
    }
  };

  const handleFetchInnInfo = async () => {
    try {
      await adminAxiosInstance.post(`/admin/users/organizations/${id}/fetch-inn-info`);
      alert('Информация по ИНН успешно обновлена');
      fetchOrganizationDetail();
    } catch (error) {
      console.error('Ошибка получения информации по ИНН:', error);
      alert('Не удалось получить информацию по ИНН');
    }
  };

  if (loading) {
    return <Container>Загрузка...</Container>;
  }

  if (!org) {
    return <Container>Организация не найдена</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/organizations')}>
          ← Назад к списку
        </BackButton>
        <Title>{org.name}</Title>
      </Header>

      <ContentGrid>
        <Section>
          <SectionTitle>Основная информация</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Название</Label>
              <Value>{org.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>ИНН</Label>
              <Value>{org.inn || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>ОГРН</Label>
              <Value>{org.ogrn || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>КПП</Label>
              <Value>{org.kpp || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Адрес</Label>
              <Value>{org.address || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Дата регистрации</Label>
              <Value>{new Date(org.created_at).toLocaleDateString('ru-RU')}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Источник регистрации</Label>
              <Value>{org.referral_source || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Баланс</Label>
              <Value>{org.balance || 0} ₽</Value>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <SectionTitle>Владелец</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Имя</Label>
              <Value>{org.owner?.name || 'Не указано'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Фамилия</Label>
              <Value>{org.owner?.surname || 'Не указано'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email</Label>
              <Value>{org.owner?.email || 'Не указан'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Телефон</Label>
              <Value>{org.owner?.phone || 'Не указан'}</Value>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <SectionTitle>Подписка</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Тариф</Label>
              <Value>{org.subscription?.plan_name || 'Бесплатный'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Статус</Label>
              <StatusBadge status={org.subscription?.status}>
                {org.subscription?.status === 'active' ? 'Активна' :
                 org.subscription?.status === 'trial' ? 'Пробная' :
                 org.subscription?.status === 'expired' ? 'Истекла' : 'Пробная'}
              </StatusBadge>
            </InfoItem>
            {org.subscription?.started_at && (
              <InfoItem>
                <Label>Дата начала</Label>
                <Value>{new Date(org.subscription.started_at).toLocaleDateString('ru-RU')}</Value>
              </InfoItem>
            )}
            {org.subscription?.access_until && (
              <InfoItem>
                <Label>Действует до</Label>
                <Value>{new Date(org.subscription.access_until).toLocaleDateString('ru-RU')}</Value>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Ниша бизнеса</SectionTitle>
            {org.inn && (
              <Button onClick={handleFetchInnInfo}>
                Обновить из DaData
              </Button>
            )}
          </SectionHeader>
          <InfoGrid>
            {org.niche?.company_full_name && (
              <InfoItem style={{ gridColumn: '1 / -1' }}>
                <Label>Полное наименование</Label>
                <Value>{org.niche.company_full_name}</Value>
              </InfoItem>
            )}
            <InfoItem>
              <Label>ОКВЭД</Label>
              <Value>{org.niche?.okved_code || 'Не определен'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Описание ОКВЭД</Label>
              <Value>{org.niche?.okved_name || 'Не определено'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Ниша</Label>
              {editingNiche ? (
                <EditContainer>
                  <Input
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    placeholder="Введите нишу"
                  />
                  <EditButtons>
                    <SaveButton onClick={handleUpdateNiche}>Сохранить</SaveButton>
                    <CancelButton onClick={() => {
                      setEditingNiche(false);
                      setNewNiche(org.niche?.niche || '');
                    }}>
                      Отмена
                    </CancelButton>
                  </EditButtons>
                </EditContainer>
              ) : (
                <ValueWithEdit>
                  <Value>{org.niche?.niche || 'Не определена'}</Value>
                  <EditButton onClick={() => setEditingNiche(true)}>
                    Редактировать
                  </EditButton>
                </ValueWithEdit>
              )}
            </InfoItem>
            {org.niche?.is_manual && (
              <InfoItem>
                <Label>Способ определения</Label>
                <Badge>Установлено вручную</Badge>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>
      </ContentGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'active') return '#d1fae5';
    if (props.status === 'trial') return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.status === 'active') return '#059669';
    if (props.status === 'trial') return '#d97706';
    return '#dc2626';
  }};
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: #dbeafe;
  color: #1e40af;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5568d3;
  }
`;

const ValueWithEdit = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
  }
`;

export default AdminOrganizationDetail;

