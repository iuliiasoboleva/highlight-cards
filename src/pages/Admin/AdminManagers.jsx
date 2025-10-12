import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import adminAxiosInstance from '../../adminAxiosInstance';

const AdminManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [loginLogs, setLoginLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'manager'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    setAdminUser(user);
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await adminAxiosInstance.get('/admin/auth/managers');
      setManagers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки менеджеров:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      } else if (error.response?.status === 403) {
        alert('Доступ запрещен. Требуются права супер админа');
        navigate('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.password) {
      alert('Заполните все поля');
      return;
    }

    try {
      await adminAxiosInstance.post('/admin/auth/managers', formData);
      alert('Менеджер успешно добавлен');
      setShowAddForm(false);
      setFormData({ email: '', name: '', password: '', role: 'manager' });
      fetchManagers();
    } catch (error) {
      console.error('Ошибка добавления менеджера:', error);
      alert(error.response?.data?.detail || 'Не удалось добавить менеджера');
    }
  };

  const handleDeleteManager = async (managerId, managerName) => {
    if (!window.confirm(`Вы уверены, что хотите удалить менеджера "${managerName}"?`)) {
      return;
    }

    try {
      await adminAxiosInstance.delete(`/admin/auth/managers/${managerId}`);
      alert('Менеджер удален');
      fetchManagers();
    } catch (error) {
      console.error('Ошибка удаления менеджера:', error);
      alert(error.response?.data?.detail || 'Не удалось удалить менеджера');
    }
  };

  const handleViewLogs = async (managerId, managerName) => {
    try {
      setSelectedManager({ id: managerId, name: managerName });
      const response = await adminAxiosInstance.get(`/admin/auth/login-logs/${managerId}`);
      setLoginLogs(response.data);
      setShowLogs(true);
    } catch (error) {
      console.error('Ошибка загрузки журнала:', error);
      alert('Не удалось загрузить журнал входов');
    }
  };

  const isSuperAdmin = adminUser?.role === 'super_admin';

  if (loading) {
    return <Container>Загрузка...</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/dashboard')}>
          ← Назад к дашборду
        </BackButton>
        <TitleRow>
          <Title>Управление менеджерами</Title>
          {isSuperAdmin && (
            <AddButton onClick={() => setShowAddForm(true)}>
              + Добавить менеджера
            </AddButton>
          )}
        </TitleRow>
      </Header>

      {showAddForm && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Добавить нового менеджера</ModalTitle>
              <CloseButton onClick={() => setShowAddForm(false)}>×</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleAddManager}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Имя</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Пароль</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Минимум 6 символов"
                  required
                  minLength="6"
                />
              </FormGroup>
              <FormGroup>
                <Label>Роль</Label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="manager">Менеджер</option>
                  <option value="super_admin">Супер администратор</option>
                </Select>
              </FormGroup>
              <FormButtons>
                <SubmitButton type="submit">Добавить</SubmitButton>
                <CancelButton type="button" onClick={() => setShowAddForm(false)}>
                  Отмена
                </CancelButton>
              </FormButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showLogs && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Журнал входов: {selectedManager?.name}</ModalTitle>
              <CloseButton onClick={() => setShowLogs(false)}>×</CloseButton>
            </ModalHeader>
            {loginLogs.length > 0 ? (
              <LogsTable>
                <LogsHeader>
                  <LogCell>Дата и время</LogCell>
                  <LogCell>IP адрес</LogCell>
                  <LogCell>Устройство</LogCell>
                </LogsHeader>
                {loginLogs.map((log) => (
                  <LogsRow key={log.id}>
                    <LogCell>
                      {new Date(log.logged_in_at).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </LogCell>
                    <LogCell>{log.ip_address || 'Не определен'}</LogCell>
                    <LogCell>
                      {log.device_info || log.user_agent?.slice(0, 50) + '...' || 'Не определено'}
                    </LogCell>
                  </LogsRow>
                ))}
              </LogsTable>
            ) : (
              <EmptyState>Нет записей о входах</EmptyState>
            )}
          </ModalContent>
        </Modal>
      )}

      <Content>
        <Table>
          <TableHeader>
            <Cell>Имя</Cell>
            <Cell>Email</Cell>
            <Cell>Роль</Cell>
            <Cell>Статус</Cell>
            <Cell>Дата создания</Cell>
            <Cell>Действия</Cell>
          </TableHeader>
          {managers.map((manager) => (
            <TableRow key={manager.id}>
              <Cell>
                <ManagerName>{manager.name}</ManagerName>
              </Cell>
              <Cell>{manager.email}</Cell>
              <Cell>
                <RoleBadge role={manager.role}>
                  {manager.role === 'super_admin' ? 'Супер админ' : 'Менеджер'}
                </RoleBadge>
              </Cell>
              <Cell>
                <StatusBadge active={manager.is_active}>
                  {manager.is_active ? 'Активен' : 'Неактивен'}
                </StatusBadge>
              </Cell>
              <Cell>
                {new Date(manager.created_at).toLocaleDateString('ru-RU')}
              </Cell>
              <Cell>
                <ActionButtons>
                  <ActionButton onClick={() => handleViewLogs(manager.id, manager.name)}>
                    📋 Журнал
                  </ActionButton>
                  {isSuperAdmin && manager.role !== 'super_admin' && (
                    <DeleteButton onClick={() => handleDeleteManager(manager.id, manager.name)}>
                      🗑️ Удалить
                    </DeleteButton>
                  )}
                </ActionButtons>
              </Cell>
            </TableRow>
          ))}
        </Table>

        {managers.length === 0 && (
          <EmptyState>Нет менеджеров</EmptyState>
        )}
      </Content>
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

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1.5fr;
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
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1.5fr;
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

const ManagerName = styled.span`
  font-weight: 600;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.role === 'super_admin' ? '#dbeafe' : '#f3e8ff'};
  color: ${props => props.role === 'super_admin' ? '#1e40af' : '#7c3aed'};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.active ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.active ? '#059669' : '#dc2626'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5568d3;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
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

const Select = styled.select`
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

const FormButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
  }
`;

const LogsTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogsHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const LogsRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const LogCell = styled.div`
  font-size: 13px;
  color: #1a1a1a;
`;

export default AdminManagers;

