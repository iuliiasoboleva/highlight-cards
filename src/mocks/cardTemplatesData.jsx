// SPA салон
// Автозаправка
// Барбершоп
// Бассейн
import { faTShirt } from '@fortawesome/free-solid-svg-icons';

export const mockTemplateCards = [
  {
    id: 1,
    status: 'stamp',
    cardImg: '/strip.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '',
    title: 'Штампы',
    isActive: false,
    frameUrl: '/phone.svg',
    name: 'SPA салон',
    stamps: 2,
    subscribersCount: 1,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
    design: {
      logo: null,
      icon: null,
      background: null,
      stampsQuantity: 8,
      stampIcon: faTShirt,
      colors: {
        cardBackground: 'red',
        centerBackground: '#F6F6F6',
        textColor: '#1F1E1F',
      },
    },
  },
  {
    id: 2,
    status: 'stamp',
    cardImg: '/strip-one.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '',
    title: 'Штампы',
    isActive: false,
    stamps: 2,
    frameUrl: '/phone.svg',
    name: 'Автозаправка',
    subscribersCount: 1,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
  },
  {
    id: 3,
    status: 'stamp',
    cardImg: '/strip-one.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '',
    title: 'Штампы',
    isActive: false,
    stamps: 10,
    frameUrl: '/phone.svg',
    name: 'Барбершоп',
    subscribersCount: 1,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
  },
  {
    id: 4,
    status: 'stamp',
    cardImg: '/strip-one.png',
    urlCopy: 'https://take.cards/cMla3',
    qrImg: '',
    title: 'Штампы',
    isActive: false,
    stamps: 10,
    frameUrl: '/phone.svg',
    name: 'Бассейн',
    subscribersCount: 1,
    pushNotification: {
      message: 'У нас скидка',
      scheduledDate: '',
      locations: [],
    },
  },
];
