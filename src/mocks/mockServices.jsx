export const mockServices = [
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description:
      'Подключите аккаунт Twilio для настройки собственного имени отправителя SMS. Биллинг SMS оплачивается отдельно по тарифам оператора.',
    link: 'https://twilio.com/',
    icon: '/service-twiliosms.svg',
    fields: ['API key', 'SID'],
  },
  {
    id: 'mailgun',
    name: 'Mailgun',
    description: 'Подключите аккаунт Mailgun для настройки собственного имени отправителя email.',
    link: 'https://mailgun.com/',
    icon: '/service-mailgun.svg',
    fields: ['API key', 'Домен', 'Email отправителя', 'Имя отправителя', 'Регион'],
  },
  {
    id: 'smtp',
    name: 'Custom SMTP',
    description: 'Подключите аккаунт SMTP для настройки собственного имени отправителя email.',
    icon: '/service-smtp.svg',
    fields: ['SMTP-хост', 'Порт', 'Email', 'Пароль'],
  },
];
