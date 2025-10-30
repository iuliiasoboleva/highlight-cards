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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
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
  color: #10b981;
`;

const StatSubValue = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const ChartSection = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const NicheList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NicheItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const NicheName = styled.span`
  font-weight: 600;
  color: #333;
`;

const NicheRevenue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const AdminFinance = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [revenueByNiche, setRevenueByNiche] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchFinanceData(token);
  }, [navigate]);

  const fetchFinanceData = async (token) => {
    setLoading(true);
    try {
      const [statsResponse, nicheResponse] = await Promise.all([
        adminAxiosInstance.get('/admin/finance/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        adminAxiosInstance.get('/admin/finance/revenue-by-niche', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsResponse.data);
      setRevenueByNiche(nicheResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
        </Header>
        <Loading>Загрузка...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
      </Header>

      <Content>
        <Title>Финансовая аналитика</Title>

        {stats && (
          <StatsGrid>
            <StatCard>
              <StatLabel>Доход за этот месяц</StatLabel>
              <StatValue>{formatCurrency(stats.this_month_revenue)}</StatValue>
              <StatSubValue>Прошлый месяц: {formatCurrency(stats.last_month_revenue)}</StatSubValue>
            </StatCard>

            <StatCard>
              <StatLabel>MRR (Ежемесячный доход)</StatLabel>
              <StatValue>{formatCurrency(stats.monthly_recurring_revenue)}</StatValue>
              <StatSubValue>{stats.active_subscriptions} активных подписок</StatSubValue>
            </StatCard>

            <StatCard>
              <StatLabel>Всего за всё время</StatLabel>
              <StatValue>{formatCurrency(stats.total_revenue)}</StatValue>
            </StatCard>
          </StatsGrid>
        )}

        {revenueByNiche.length > 0 && (
          <ChartSection>
            <ChartTitle>Доходы по нишам</ChartTitle>
            <NicheList>
              {revenueByNiche
                .sort((a, b) => b.total_revenue - a.total_revenue)
                .map((item) => (
                  <NicheItem key={item.niche}>
                    <div>
                      <NicheName>{item.niche}</NicheName>
                      <StatSubValue>{item.count} платежей</StatSubValue>
                    </div>
                    <NicheRevenue>{formatCurrency(item.total_revenue)}</NicheRevenue>
                  </NicheItem>
                ))}
            </NicheList>
          </ChartSection>
        )}
      </Content>
    </Container>
  );
};

export default AdminFinance;
