import { Star } from 'lucide-react';

import { pluralize } from '../helpers/pluralize';

export const STATUS_CONFIG = {
  certificate: [
    { label: 'Баланс', valueKey: 'balanceMoney', suffix: '₽' },
    { label: 'Имя', valueKey: 'certificateName', suffix: '' },
  ],
  cashback: [
    { label: 'Баллы', valueKey: 'credits', suffix: '' },
    {
      label: 'Текущий процент кешбэка',
      valueKey: 'cashbackPercent',
      suffix: '%',
    },
    { label: 'Текущий статус кешбэка', valueKey: 'cashbackStatus' },
  ],
  subscription: [
    { label: 'Текущее количество баллов', valueKey: 'score' },
    { label: 'Общее количество визитов', valueKey: 'visitsCount' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  stamp: [
    {
      label: 'До получения награды',
      valueKey: 'restStamps',
      format: (value) => `${value} ${pluralize(value, ['штамп', 'штампа', 'штампов'])}`,
    },
    {
      label: 'Доступно наград',
      valueKey: 'stamps',
      format: (value) => `${value} ${pluralize(value, ['награда', 'награды', 'наград'])}`,
    },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  discount: [
    {
      label: 'Текущий процент скидки',
      valueKey: 'discountPercent',
      suffix: '%',
    },
    {
      label: 'Текущий статус скидки',
      valueKey: 'discountStatus',
      suffix: '',
    },
  ],
};

export const defaultCardTemplate = {
  id: 3,
  status: 'stamp',
  name: 'Накопительная карта',
  isActive: false,
  urlCopy: 'https://take.cards/cMla3',
  qrImg: '/qr-code.svg',
  frameUrl: '/phone.svg',
  balanceMoney: 1800,
  stamps: 2,
  cardImg: '',
  untilNextReward: 2,
  currentLevel: '',
  balance: 500,
  title: 'Сертификат',
  expirationDate: '00.00.0000',
  firstVisitDiscount: '10',
  visitsCount: 8,
  certificateName: 'Ivan',
  cardLevel: 'Золотой',
  discountStatus: 'Бронзовый',
  discountPercent: 1,
  credits: 1000,
  cashbackStatus: 'Бронзовый',
  cashbackPercent: 1,
  settings: {
    rewardProgram: 'spending',
    card: {},
    stamp: {},
    spendingAmount: 500,
    spendingStamps: 1,
    visitStamps: 1,
    limitVisitPerDay: false,
    locations: [],
  },
  score: 10,
  subscribersCount: 0,
  pushNotification: {
    message: '',
    scheduledDate: '',
    locations: [
      {
        name: 'Москва, ул. Арбат, 10',
        coords: [55.7522, 37.6156],
        active: true,
        message: 'Вы рядом с нашим магазином на Арбате! Зайдите за подарком 🎁',
      },
      {
        name: 'Санкт-Петербург, Невский проспект',
        coords: [59.9343, 30.3351],
        active: true,
        message: 'Скидка 15% для гостей у Невского! Ждём вас 👋',
      },
    ],
  },
  design: {
    logo: null,
    icon: null,
    background: null,
    stampsQuantity: 10,
    stampIcon: Star,
    colors: {
      cardBackground: '#FFFFFF',
      centerBackground: '#F6F6F6',
      textColor: '#1F1E1F',
    },
  },
};
