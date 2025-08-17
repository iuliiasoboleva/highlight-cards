export const mockLocations = [
  {
    id: 'OrAwSUJw3JUm6jPXeKxXA',
    name: 'кофе',
    address: 'москва',
    coords: { lat: 55.7558, lon: 37.6173 },
    employees: ['Иван Иванов'],
    clientsCount: 150,
    cardsIssued: 120,
    pointsAccumulated: 2000,
  },
  {
    id: 'L404zye3C8yuHGxYSC_SL',
    name: 'новороссийск',
    address: 'новороссийск',
    coords: { lat: 52.2, lon: 65.5 },
    employees: ['Мария Петрова'],
    clientsCount: 75,
    cardsIssued: 50,
    pointsAccumulated: 800,
  },
];

export const locationsHeaders = [
  { label: 'Название', key: 'name' },
  { label: 'Адрес', key: 'address' },
  { label: 'Сотрудники', key: 'employees' },
  { label: 'Клиенты привязаны', key: 'clientsCount' },
  { label: 'Карт выдано', key: 'cardsIssued' },
  { label: 'Баллов начислено', key: 'pointsAccumulated' },
  { label: 'Сеть', key: 'network' },
];

export const MOCK_CARDS = [
  {
    id: 101,
    name: 'Штамп',
    title: 'Штамп',
    frameUrl: '/frame-ios.svg',
    isActive: true,
    pushNotification: { message: 'Соберите штампы — получите подарок!' },
  },
  {
    id: 102,
    name: 'Скидка',
    title: 'Скидка',
    frameUrl: '/frame-ios.svg',
    isActive: true,
    pushNotification: { message: '-10% на все позиции до конца недели' },
  },
];

export const MOCK_LOCATIONS_INIT = [
  {
    id: 5001,
    name: 'Кофейня на Ленина, 10',
    coords: { lat: 55.75222, lon: 37.61556 },
    active: true,
  },
  {
    id: 5002,
    name: 'ТЦ «Галактика», 2 этаж',
    coords: { lat: 55.76012, lon: 37.62045 },
    active: false,
  },
];

export const mockBranches = [
  { id: 1, name: 'Магазин на Арбате', address: 'ул. Арбат, 12', employees: ['Иванов Иван'] },
  { id: 2, name: 'ТЦ Европа', address: 'пр-т Мира, 55', employees: ['Петров Петр'] },
];
