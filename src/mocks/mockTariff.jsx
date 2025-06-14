export const mockTariff = {
  name: 'Старт',
  billing: 'Помесячная оплата',
  price: 2990,
  nextPaymentDate: '10.04.2025',
  nextPaymentTime: '00:33',
  daysLeft: 10,
};

export const tariffPlans = [
  {
    name: 'СТАРТ',
    prices: {
      year: 20990,
      quarter: 8970,
      month: 2990,
    },
    integrations: '—',
    customFields: false,
    permissions: false,
  },
  {
    name: 'РОСТ',
    prices: {
      year: 40900,
      quarter: 14700,
      month: 4900,
    },
    integrations: '—',
    customFields: true,
    permissions: false,
  },
  {
    name: 'БИЗНЕС',
    prices: {
      year: 80900,
      quarter: 26700,
      month: 8900,
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
