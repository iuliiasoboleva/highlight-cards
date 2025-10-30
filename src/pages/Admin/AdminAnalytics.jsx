import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import adminAxiosInstance from '../../adminAxiosInstance';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [dateFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAxiosInstance.get('/admin/analytics/dashboard', {
        params: { period: dateFilter },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container>Загрузка...</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/dashboard')}>← Назад к дашборду</BackButton>
        <Title>Детальная аналитика</Title>
      </Header>

      <FilterBar>
        <FilterButton active={dateFilter === 'all'} onClick={() => setDateFilter('all')}>
          Всё время
        </FilterButton>
        <FilterButton active={dateFilter === 'year'} onClick={() => setDateFilter('year')}>
          Год
        </FilterButton>
        <FilterButton
          active={dateFilter === 'half_year'}
          onClick={() => setDateFilter('half_year')}
        >
          Полгода
        </FilterButton>
        <FilterButton active={dateFilter === 'month'} onClick={() => setDateFilter('month')}>
          Месяц
        </FilterButton>
        <FilterButton active={dateFilter === 'week'} onClick={() => setDateFilter('week')}>
          Неделя
        </FilterButton>
      </FilterBar>

      <StatsGrid>
        <StatCard>
          <StatLabel>Всего пользователей</StatLabel>
          <StatValue>{stats?.total_users || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Активные подписки</StatLabel>
          <StatValue>{stats?.active_subscriptions || 0}</StatValue>
          <StatPercent>
            {stats?.total_users > 0
              ? ((stats?.active_subscriptions / stats?.total_users) * 100).toFixed(1)
              : 0}
            % от всех
          </StatPercent>
        </StatCard>

        <StatCard>
          <StatLabel>Новых за день</StatLabel>
          <StatValue>{stats?.new_users_day || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Новых за неделю</StatLabel>
          <StatValue>{stats?.new_users_week || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Новых за месяц</StatLabel>
          <StatValue>{stats?.new_users_month || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Новых за полгода</StatLabel>
          <StatValue>{stats?.new_users_half_year || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Новых за год</StatLabel>
          <StatValue>{stats?.new_users_year || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Средний чек (MRR)</StatLabel>
          <StatValue>{stats?.average_check || 0} ₽</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Распределение по нишам</SectionTitle>
        {stats?.users_by_niche && stats.users_by_niche.length > 0 ? (
          <Table>
            <TableHeader>
              <Cell>Ниша</Cell>
              <Cell>Пользователей</Cell>
              <Cell>С подпиской</Cell>
              <Cell>Конверсия</Cell>
              <Cell>% от всех</Cell>
            </TableHeader>
            {stats.users_by_niche.map((niche, index) => {
              const conversionRate =
                niche.count > 0 ? ((niche.with_subscription / niche.count) * 100).toFixed(1) : 0;
              const percentOfTotal =
                stats.total_users > 0 ? ((niche.count / stats.total_users) * 100).toFixed(1) : 0;

              return (
                <TableRow key={index}>
                  <Cell>
                    <NicheName>{niche.niche || 'Не определена'}</NicheName>
                  </Cell>
                  <Cell>{niche.count}</Cell>
                  <Cell>{niche.with_subscription || 0}</Cell>
                  <Cell>
                    <Badge
                      status={
                        conversionRate >= 30 ? 'good' : conversionRate >= 15 ? 'medium' : 'low'
                      }
                    >
                      {conversionRate}%
                    </Badge>
                  </Cell>
                  <Cell>{percentOfTotal}%</Cell>
                </TableRow>
              );
            })}
          </Table>
        ) : (
          <EmptyState>Нет данных по нишам</EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>Ключевые метрики</SectionTitle>
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Общая конверсия в платных</MetricLabel>
            <MetricValue>
              {stats?.total_users > 0
                ? ((stats?.active_subscriptions / stats?.total_users) * 100).toFixed(1)
                : 0}
              %
            </MetricValue>
            <MetricDescription>
              {stats?.active_subscriptions || 0} из {stats?.total_users || 0} пользователей
            </MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Средний чек активной подписки</MetricLabel>
            <MetricValue>{stats?.average_check || 0} ₽</MetricValue>
            <MetricDescription>MRR (Monthly Recurring Revenue)</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Среднее время до активации</MetricLabel>
            <MetricValue>
              {stats?.avg_activation_time
                ? `${Math.round(stats.avg_activation_time)} дней`
                : 'Нет данных'}
            </MetricValue>
            <MetricDescription>От регистрации до первой оплаты</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Прирост за неделю</MetricLabel>
            <MetricValue $positive={stats?.new_users_week > 0}>
              {stats?.new_users_week > 0 ? '+' : ''}
              {stats?.new_users_week || 0}
            </MetricValue>
            <MetricDescription>Новых пользователей</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Прирост за месяц</MetricLabel>
            <MetricValue $positive={stats?.new_users_month > 0}>
              {stats?.new_users_month > 0 ? '+' : ''}
              {stats?.new_users_month || 0}
            </MetricValue>
            <MetricDescription>Новых пользователей</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Тренд роста</MetricLabel>
            <MetricValue
              $positive={(stats?.new_users_month || 0) > (stats?.new_users_week || 0) * 4}
            >
              {(stats?.new_users_month || 0) > (stats?.new_users_week || 0) * 4
                ? '📈 Растёт'
                : '📉 Стабильно'}
            </MetricValue>
            <MetricDescription>На основе данных за месяц</MetricDescription>
          </MetricCard>
        </MetricsGrid>
      </Section>

      <Section>
        <SectionTitle>Источники регистрации</SectionTitle>
        {stats?.sources && stats.sources.length > 0 ? (
          <Table>
            <TableHeader>
              <Cell>Источник</Cell>
              <Cell>Пользователей</Cell>
              <Cell>% от всех</Cell>
            </TableHeader>
            {stats.sources.map((source, index) => (
              <TableRow key={index}>
                <Cell>{source.source || 'Не указан'}</Cell>
                <Cell>{source.count}</Cell>
                <Cell>
                  {stats.total_users > 0
                    ? ((source.count / stats.total_users) * 100).toFixed(1)
                    : 0}
                  %
                </Cell>
              </TableRow>
            ))}
          </Table>
        ) : (
          <EmptyState>Нет данных об источниках</EmptyState>
        )}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
  padding: 40px;
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

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#374151')};
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e5e7eb')};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? '#5568d3' : '#f9fafb')};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
`;

const StatPercent = styled.div`
  font-size: 14px;
  color: #10b981;
  margin-top: 8px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const Cell = styled.div`
  font-size: 14px;
  color: #1a1a1a;
`;

const NicheName = styled.span`
  font-weight: 600;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    if (props.status === 'good') return '#d1fae5';
    if (props.status === 'medium') return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${(props) => {
    if (props.status === 'good') return '#059669';
    if (props.status === 'medium') return '#d97706';
    return '#dc2626';
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const MetricCard = styled.div`
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) =>
    props.$positive === false ? '#ef4444' : props.$positive ? '#10b981' : '#1a1a1a'};
  margin-bottom: 4px;
`;

const MetricDescription = styled.div`
  font-size: 12px;
  color: #999;
`;

export default AdminAnalytics;
