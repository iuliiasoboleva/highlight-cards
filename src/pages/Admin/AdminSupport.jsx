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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.color || '#1a1a1a'};
`;

const Filters = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
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

const TicketsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TicketCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const TicketTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    if (props.priority === 'high') return '#fee2e2';
    if (props.priority === 'normal') return '#fef3c7';
    return '#e0f2fe';
  }};
  color: ${(props) => {
    if (props.priority === 'high') return '#991b1b';
    if (props.priority === 'normal') return '#92400e';
    return '#075985';
  }};
`;

const TicketMeta = styled.div`
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const TicketDescription = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.5;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const AdminSupport = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchTickets(token);
    fetchStats(token);
  }, [navigate, statusFilter, priorityFilter]);

  const fetchTickets = async (token) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      params.append('limit', '50');

      const response = await adminAxiosInstance.get(`/admin/support/tickets?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (token) => {
    try {
      const response = await adminAxiosInstance.get('/admin/support/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
      </Header>

      <Content>
        <Title>Поддержка клиентов</Title>

        {stats && (
          <StatsGrid>
            <StatCard>
              <StatLabel>Всего тикетов</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Новые</StatLabel>
              <StatValue color="#667eea">{stats.new}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>В работе</StatLabel>
              <StatValue color="#f59e0b">{stats.in_progress}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Решённые</StatLabel>
              <StatValue color="#10b981">{stats.resolved}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Высокий приоритет</StatLabel>
              <StatValue color="#ef4444">{stats.high_priority_pending}</StatValue>
            </StatCard>
          </StatsGrid>
        )}

        <Filters>
          <div>
            <StatLabel>Статус</StatLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Все</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="resolved">Решённые</option>
            </Select>
          </div>

          <div>
            <StatLabel>Приоритет</StatLabel>
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">Все</option>
              <option value="low">Низкий</option>
              <option value="normal">Нормальный</option>
              <option value="high">Высокий</option>
            </Select>
          </div>
        </Filters>

        {loading ? (
          <Loading>Загрузка...</Loading>
        ) : (
          <TicketsList>
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id}>
                <TicketHeader>
                  <TicketTitle>{ticket.subject}</TicketTitle>
                  <Badge priority={ticket.priority}>
                    {ticket.priority === 'high'
                      ? 'Высокий'
                      : ticket.priority === 'normal'
                        ? 'Нормальный'
                        : 'Низкий'}
                  </Badge>
                </TicketHeader>
                <TicketMeta>
                  <span>ID: #{ticket.id}</span>
                  <span>
                    Статус:{' '}
                    {ticket.status === 'new'
                      ? 'Новый'
                      : ticket.status === 'in_progress'
                        ? 'В работе'
                        : 'Решён'}
                  </span>
                  <span>{new Date(ticket.created_at).toLocaleDateString('ru-RU')}</span>
                  {ticket.source && <span>Источник: {ticket.source}</span>}
                </TicketMeta>
                {ticket.description && (
                  <TicketDescription>
                    {ticket.description.length > 200
                      ? `${ticket.description.substring(0, 200)}...`
                      : ticket.description}
                  </TicketDescription>
                )}
              </TicketCard>
            ))}
          </TicketsList>
        )}
      </Content>
    </Container>
  );
};

export default AdminSupport;
