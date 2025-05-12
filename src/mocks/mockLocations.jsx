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
];
