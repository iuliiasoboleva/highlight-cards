// Скидочная карта
// Штампы
// Кэшбек
// Абонемент
// Подарочный сертификат

import { Flower, Ticket } from 'lucide-react';

export const mockCards = [
  {
    id: 32,
    status: 'subscription',
    cardImg: '/strip.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '/qr-code.svg',
    title: 'Абонемент',
    isActive: true,
    frameUrl: '/phone.svg',
    name: 'Карта №1',
    visitsCount: 2,
    expirationDate: '02.06.2025',
    score: 10,
    subscribersCount: 150,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
      stampIcon: Ticket,
    },
  },
  {
    id: 74,
    status: 'stamp',
    cardImg: '',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '/qr-code.svg',
    title: 'Штампы',
    isActive: false,
    stamps: 2,
    frameUrl: '/phone.svg',
    expirationDate: '01.02.2026',
    name: 'Карта №2',
    subscribersCount: 1,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
      stampIcon: Flower,
    },
  },
  {
    id: 82,
    status: 'cashback',
    cardImg: '/strip.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '/qr-code.svg',
    title: 'Кэшбэк',
    isActive: false,
    frameUrl: '/phone.svg',
    name: 'Карта №3',
    credits: 3,
    expirationDate: '00.00.0000',
    firstVisitDiscount: '10',
    subscribersCount: 110,
    cashbackPercent: 5,
    cashbackStatus: 'Бронзовый',
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
    },
  },
  {
    id: 93,
    status: 'discount',
    cardImg: '/strip.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '/qr-code.svg',
    title: 'Скидочная карта',
    isActive: false,
    frameUrl: '/phone.svg',
    name: 'Карта №4',
    discountStatus: 'Бронзовый',
    discountPercent: 1,
    subscribersCount: 10,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
    },
  },
  {
    id: 92,
    status: 'certificate',
    cardImg: '/pool.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '/qr-code.svg',
    title: 'Подарочный сертификат',
    isActive: false,
    frameUrl: '/phone.svg',
    name: 'Карта №5',
    balanceMoney: 1800,
    certificateName: 'Ivan',
    subscribersCount: 150,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
    },
  },
];
