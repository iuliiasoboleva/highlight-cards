export const mockTariff = {
  name: 'Start (Пробный)',
  billing: 'С годовой оплатой',
  price: 25,
  nextPaymentDate: '10/04/2025',
  nextPaymentTime: '00:33',
  daysLeft: 10,
};

export const tariffPlans = [
  {
    name: 'START',
    prices: {
      year: 19,
      quarter: 22,
      month: 25,
    },
    integrations: '—',
    customFields: false,
    permissions: false,
  },
  {
    name: 'GROW',
    prices: {
      year: 35,
      quarter: 39,
      month: 45,
    },
    integrations: '—',
    customFields: true,
    permissions: false,
  },
  {
    name: 'BUSINESS',
    prices: {
      year: 69,
      quarter: 79,
      month: 85,
    },
    integrations: '3 интеграции',
    customFields: true,
    permissions: true,
  },
];

export const mockPaymentHistory = [
  {
    id: 1,
    date: '2023-05-15',
    amount: '$120',
    plan: 'START (Год)',
    status: 'Успешно',
    invoice: 'INV-2023-05-001',
  },
  {
    id: 2,
    date: '2023-04-15',
    amount: '$120',
    plan: 'START (Год)',
    status: 'Успешно',
    invoice: 'INV-2023-04-001',
  },
  {
    id: 3,
    date: '2023-03-15',
    amount: '$120',
    plan: 'START (Год)',
    status: 'Успешно',
    invoice: 'INV-2023-03-001',
  },
  {
    id: 4,
    date: '2023-02-15',
    amount: '$15',
    plan: 'START (Месяц)',
    status: 'Успешно',
    invoice: 'INV-2023-02-001',
  },
  {
    id: 5,
    date: '2023-01-15',
    amount: '$15',
    plan: 'START (Месяц)',
    status: 'Успешно',
    invoice: 'INV-2023-01-001',
  },
];
