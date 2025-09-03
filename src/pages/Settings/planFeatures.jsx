export const planFeatures = [
  {
    key: 'free',
    name: 'Бесплатный',
    monthly: 0,
    yearlyMonthly: 0,
    description: '7 дней доступа без привязки карты. Полный функционал тарифа «Бизнес».',
    popular: false,
  },
  {
    key: 'business',
    name: 'Бизнес',
    monthly: 6990,
    yearlyMonthly: Math.round(6990 * 0.8),
    description: 'Безлимит: карты, сотрудники, уведомления, сертификаты.',
    popular: true,
  },
  {
    key: 'network',
    name: 'Сеть',
    monthly: 3990,
    yearlyMonthly: Math.round(3990 * 0.8),
    description: 'Тот же функционал, гибкая стоимость от 3 точек',
    note: 'от 3 990₽ / мес / точка',
    popular: false,
  },
];
