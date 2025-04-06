export const mockFilters = [
  { label: 'Ваши диалоги', count: 3, icon: '👤' },
  { label: 'Избранное', count: 1, icon: '⭐' },
  { label: 'Отправленные', count: 1, icon: '📤' },
  { label: 'Полученные', count: 2, icon: '📥' },
  { label: 'Открытые', count: 1, icon: '📂' },
  { label: 'Не прочитанные', count: 1, icon: '📪' },
  { label: 'С ответом', count: 0, icon: '✅' },
];

export const mockDialogs = [
  {
    id: 1,
    sender: 'Иван Иванов',
    message: 'Здравствуйте! Хотел бы узнать подробнее об акции.',
    time: '12:34',
    unread: true,
    tags: ['Полученные'],
  },
  {
    id: 2,
    sender: 'Ольга Смирнова',
    message: 'Спасибо за информацию!',
    time: '09:20',
    unread: false,
    tags: ['Отправленные', 'Избранное'],
  },
  {
    id: 3,
    sender: 'Антон Петров',
    message: 'Когда начнется распродажа?',
    time: 'Вчера',
    unread: false,
    tags: ['Полученные'],
  },
];
