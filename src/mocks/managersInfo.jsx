export const initialManagers = [
  {
    id: 1,
    name: 'Иван',
    surname: 'Иванов',
    locations: ['Точка 1'],
    status: 'Активен',
    shift: {
      startShift: '11:00',
      endShift: '19:00',
    },
  },
  {
    id: 2,
    name: 'Иван',
    surname: 'Иванов',
    locations: [],
    status: 'Заблокирован',
    shift: {
      startShift: '11:00',
      endShift: '19:00',
    },
  },
];

export const managersHeaders = [
  { key: 'name', label: 'Имя' },
  { key: 'surname', label: 'Фамилия' },
  { key: 'locations', label: 'Точки продаж' },
  { key: 'shift', label: 'Смена' },
  { key: 'status', label: 'Статус' },
];
