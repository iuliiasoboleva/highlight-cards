export const MOCK_TARIFFS = [
  {
    name: 'Start',
    prices: { month: 1900, year: 1900 * 12 * 0.85 },
    integrations: '—',
    customFields: false,
    permissions: false,
  },
  {
    name: 'Grow',
    prices: { month: 3900, year: 3900 * 12 * 0.85 },
    integrations: 'Yclients',
    customFields: true,
    permissions: true,
  },
  {
    name: 'Business',
    prices: { month: 6900, year: 6900 * 12 * 0.85 },
    integrations: 'Yclients, Keeper',
    customFields: true,
    permissions: true,
  },
];

export const MOCK_SUBSCRIPTION = {
  status: 'trial', // 'active' | 'trial' | 'expired'
  days_left: 4,
};

export const MOCK_PAYMENTS = [
  {
    paid_at: '2025-07-03T12:00:00Z',
    amount: 6900,
    plan_name: 'Business (месяц)',
    status: 'Успешно',
    invoice_number: 'INV-10231',
  },
  {
    paid_at: '2025-06-03T12:00:00Z',
    amount: 6900,
    plan_name: 'Business (месяц)',
    status: 'Успешно',
    invoice_number: 'INV-10197',
  },
];

export const MOCK_BALANCE = 1500;
