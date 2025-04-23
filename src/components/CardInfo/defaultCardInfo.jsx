import { faStar } from '@fortawesome/free-solid-svg-icons';

import { pluralize } from '../../helpers/pluralize';

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
  club: [
    { label: 'Уровень клубной карты', valueKey: 'cardLevel', suffix: '' },
    {
      label: 'Доступный лимит',
      valueKey: 'visitsCount',
      format: (value) => `${value} ${pluralize(value, ['визит', 'визита', 'визитов'])}`,
    },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  reward: [
    { label: 'Баланс', valueKey: 'balance', suffix: '₽' },
    {
      label: 'Текущий уровень',
      valueKey: 'currentLevel',
      defaultValue: 'Нет данных',
    },
    { label: 'До следующей награды', valueKey: 'untilNextReward' },
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
  coupon: [
    { label: 'Скидка на первый визит', valueKey: 'firstVisitDiscount' },
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
  id: 21,
  status: 'stamp',
  name: 'Накопительная карта',
  isActive: false,
  urlCopy: 'https://take.cards/cMla3',
  pdfImg: '/pdf-example.svg',
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
    barcodeType: 'qrcode',
    rewardProgram: 'spending',
    cardLimit: 'cardUnlimit',
    stampLimit: 'stampUnlimit',
    stampDuration: { value: 1, unit: 'days' },
    locations: [],
  },
  score: 10,
  subscribersCount: 0,
  pushNotification: {
    message: '',
    scheduledDate: '',
  },
  design: {
    logo: null,
    icon: null,
    background: null,
    stampsQuantity: 10,
    stampIcon: faStar,
    colors: {
      cardBackground: '#FFFFFF',
      centerBackground: '#F6F6F6',
      textColor: '#1F1E1F',
    },
  },
};
