import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
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
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
`;

const StatChange = styled.div`
  font-size: 14px;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  margin-top: 8px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const MenuCard = styled(Link)`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const MenuIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const MenuTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const MenuDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
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

const NicheCount = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      setAdminUser(JSON.parse(user));
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await adminAxiosInstance.get('/admin/analytics/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Logo>Loyal Club Admin</Logo>
        </Header>
        <Loading>Загрузка...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Logo>Loyal Club Admin</Logo>
        <UserInfo>
          <UserName>{adminUser?.name || 'Администратор'}</UserName>
          <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <Title>Дашборд</Title>

        <StatsGrid>
          <StatCard>
            <StatLabel>Всего пользователей</StatLabel>
            <StatValue>{stats?.total_users || 0}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Активные подписки</StatLabel>
            <StatValue>{stats?.active_subscriptions || 0}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Новых за неделю</StatLabel>
            <StatValue>{stats?.new_users_week || 0}</StatValue>
            <StatChange $positive>
              +{stats?.new_users_day || 0} за сегодня
            </StatChange>
          </StatCard>

          <StatCard>
            <StatLabel>Новых за месяц</StatLabel>
            <StatValue>{stats?.new_users_month || 0}</StatValue>
          </StatCard>
        </StatsGrid>

        <MenuGrid>
          <MenuCard to="/admin/organizations">
            <MenuIcon>👥</MenuIcon>
            <MenuTitle>База пользователей</MenuTitle>
            <MenuDescription>
              Управление организациями, поиск, фильтры, экспорт
            </MenuDescription>
          </MenuCard>

          <MenuCard to="/admin/analytics">
            <MenuIcon>📊</MenuIcon>
            <MenuTitle>Аналитика</MenuTitle>
            <MenuDescription>
              Подробная статистика по нишам, конверсии, оттоку
            </MenuDescription>
          </MenuCard>

          <MenuCard to="/admin/support">
            <MenuIcon>🎫</MenuIcon>
            <MenuTitle>Поддержка</MenuTitle>
            <MenuDescription>
              Тикеты, обращения клиентов, история
            </MenuDescription>
          </MenuCard>

          <MenuCard to="/admin/finance">
            <MenuIcon>💰</MenuIcon>
            <MenuTitle>Финансы</MenuTitle>
            <MenuDescription>
              Доходы, прогнозы, платежи, MRR
            </MenuDescription>
          </MenuCard>

          {adminUser?.role === 'super_admin' && (
            <MenuCard to="/admin/managers">
              <MenuIcon>⚙️</MenuIcon>
              <MenuTitle>Менеджеры</MenuTitle>
              <MenuDescription>
                Управление командой, журнал входов
              </MenuDescription>
            </MenuCard>
          )}
        </MenuGrid>

        {stats?.users_by_niche && (
          <ChartSection>
            <ChartTitle>Пользователи по нишам</ChartTitle>
            <NicheList>
              {Object.entries(stats.users_by_niche)
                .sort((a, b) => b[1] - a[1])
                .map(([niche, count]) => (
                  <NicheItem key={niche}>
                    <NicheName>{niche}</NicheName>
                    <NicheCount>{count}</NicheCount>
                  </NicheItem>
                ))}
            </NicheList>
          </ChartSection>
        )}
      </Content>
    </Container>
  );
};

export default AdminDashboard;

