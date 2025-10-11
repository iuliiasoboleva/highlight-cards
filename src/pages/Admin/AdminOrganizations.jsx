import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import adminAxiosInstance from '../../adminAxiosInstance';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
  cursor: pointer;
`;

const Content = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const Filters = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Table = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 16px 24px;
  background: #f9fafb;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 700;
  font-size: 14px;
  color: #666;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'active') return '#d1fae5';
    if (props.status === 'trial') return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.status === 'active') return '#065f46';
    if (props.status === 'trial') return '#92400e';
    return '#991b1b';
  }};
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
`;

const ExportButton = styled.button`
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

const AdminOrganizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOrganizations(token);
  }, [navigate, search, niche, subscriptionStatus]);

  const fetchOrganizations = async (token) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (niche) params.append('niche', niche);
      if (subscriptionStatus) params.append('subscription_status', subscriptionStatus);
      params.append('limit', '100');

      const response = await adminAxiosInstance.get(`/admin/users/organizations?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganizations(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await adminAxiosInstance.get('/admin/users/export-csv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'organizations.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
        <ExportButton onClick={handleExport}>Экспорт в CSV</ExportButton>
      </Header>

      <Content>
        <Title>База пользователей</Title>

        <Filters>
          <InputGroup>
            <Label>Поиск</Label>
            <Input
              placeholder="Название, ИНН, email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Ниша</Label>
            <Select value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option value="">Все</option>
              <option value="Рестораны и кафе">Рестораны и кафе</option>
              <option value="Салоны красоты">Салоны красоты</option>
              <option value="Интернет-магазины">Интернет-магазины</option>
              <option value="Студии растяжки, фитнес, танцы">Фитнес, танцы</option>
              <option value="Автосервисы, автомойки">Автосервисы</option>
              <option value="Груминг">Груминг</option>
              <option value="Косметология, стоматология">Косметология</option>
              <option value="Прочее">Прочее</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Статус подписки</Label>
            <Select value={subscriptionStatus} onChange={(e) => setSubscriptionStatus(e.target.value)}>
              <option value="">Все</option>
              <option value="trial">Пробный период</option>
              <option value="active">Активна</option>
              <option value="expired">Завершена</option>
            </Select>
          </InputGroup>
        </Filters>

        {loading ? (
          <Loading>Загрузка...</Loading>
        ) : organizations.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div>Организации не найдены</div>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <Cell>Название</Cell>
              <Cell>ИНН</Cell>
              <Cell>Email</Cell>
              <Cell>Тариф</Cell>
              <Cell>Статус</Cell>
              <Cell>Ниша</Cell>
              <Cell>Дата регистрации</Cell>
            </TableHeader>
            {organizations.map((org) => (
              <TableRow key={org.id} onClick={() => navigate(`/admin/organizations/${org.id}`)}>
                <Cell>{org.name}</Cell>
                <Cell>{org.inn || '—'}</Cell>
                <Cell>{org.email}</Cell>
                <Cell>{org.tariff}</Cell>
                <Cell>
                  <Badge status={org.subscription_status}>
                    {org.subscription_status === 'active' ? 'Активна' : 
                     org.subscription_status === 'trial' ? 'Пробная' : 'Завершена'}
                  </Badge>
                </Cell>
                <Cell>{org.niche || 'Не определена'}</Cell>
                <Cell>{new Date(org.created_at).toLocaleDateString('ru-RU')}</Cell>
              </TableRow>
            ))}
          </Table>
        )}
      </Content>
    </Container>
  );
};

export default AdminOrganizations;

