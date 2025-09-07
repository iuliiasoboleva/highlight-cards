export const mockClients = [
  {
    id: 'c1',
    name: 'Ирина Петрова',
    phone: '+7 900 123-45-67',
    cards: [
      {
        cardNumber: '000111222333',
        serialNumber: 'LC-0001',
        activeStorage: 7,
        stamps: 7,
        availableRewards: 0,
        lastRewardReceived: '',
        lastAccrual: '06.06.2025',
        cardExpirationDate: '31.12.2026',
        cardInstallationDate: '10.05.2025',
        ageInfo: 'Активна',
      },
    ],
  },

  {
    id: 'c2',
    name: 'Алексей Смирнов',
    phone: '+7 900 555-66-77',
    cards: [
      {
        cardNumber: '000111222334',
        serialNumber: 'LC-0002',
        activeStorage: 12,
        stamps: 12,
        availableRewards: 1,
        lastRewardReceived: '01.06.2025',
        lastAccrual: '07.06.2025',
        cardExpirationDate: '31.12.2025',
        cardInstallationDate: '20.11.2024',
        ageInfo: 'Активна',
      },
      {
        cardNumber: '000111222335',
        serialNumber: 'LC-0005',
        activeStorage: 3,
        stamps: 3,
        availableRewards: 0,
        lastRewardReceived: '',
        lastAccrual: '05.06.2025',
        cardExpirationDate: '30.09.2026',
        cardInstallationDate: '15.03.2025',
        ageInfo: 'Пауза',
      },
    ],
  },

  {
    id: 'c3',
    name: 'Марина Ким',
    phone: '+7 900 987-65-43',
    cards: [
      {
        cardNumber: '000000000001',
        serialNumber: 'LC-0003',
        activeStorage: 0,
        stamps: 0,
        availableRewards: 0,
        lastRewardReceived: '',
        lastAccrual: '',
        cardExpirationDate: '30.09.2025',
        cardInstallationDate: '01.06.2025',
        ageInfo: 'Заблокирована',
      },
    ],
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
  { key: 'loyalty', label: 'ЛОЯЛЬНОСТЬ' },
  { key: 'utm', label: 'UTM' },
  { key: 'device', label: 'УСТРОЙСТВО' },
  { key: 'segment', label: 'СЕГМЕНТ' },
  { key: 'cards', label: 'КАРТЫ КЛИЕНТА' },
];
