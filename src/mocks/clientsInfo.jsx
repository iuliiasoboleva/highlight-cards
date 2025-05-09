export const mockClients = [
  {
    id: 1,
    name: 'Иван',
    surname: 'Иванов',
    phone: '+71111111111',
    createdAt: '30/03/2025 21:26',
    birthdate: '04/03/1985',
    email: 'ivan@example.com',
    stampQuantity: 4,
    currentCardUsageCount: 2,
  },
  {
    id: 2,
    name: 'Мария',
    surname: 'Иванова',
    phone: '+71111111111',
    createdAt: '30/03/2025 21:26',
    birthdate: '04/03/1985',
    email: 'ivan@example.com',
    stampQuantity: 0,
    currentCardUsageCount: 1,
  },
  {
    id: 3,
    name: 'Анна',
    surname: 'Иванов',
    phone: '+71111111111',
    createdAt: '30/03/2025 21:26',
    birthdate: null,
    email: 'ivan@example.com',
    stampQuantity: 14,
    currentCardUsageCount: 52,
  },
];

export const mockClientStats = {
  totalClients: mockClients.length,
  transactions: 3,
  cardsIssued: 4,
  returnRate: 0,
};

export const mockClientsHeaders = [
  { key: 'name', label: 'ИМЯ' },
  { key: 'surname', label: 'ФАМИЛИЯ' },
  { key: 'phone', label: 'ТЕЛЕФОН' },
  { key: 'email', label: 'E-MAIL' },
  { key: 'birthdate', label: 'ДАТА РОЖДЕНИЯ' },
];
