export const mockServices = [
    {
        id: 'twilio',
        name: 'Twilio SMS',
        description: 'Подключите аккаунт Twilio для настройки собственного имени отправителя SMS. Биллинг SMS оплачивается отдельно по тарифам оператора.',
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
    {
        id: 'whatsapp',
        name: 'WhatsApp Bot',
        description: 'Добавьте WhatsApp Bot для подключения бота.',
        link: 'https://www.whatsapp.com/',
        icon: '/service-whatsappbot.svg',
        fields: ['Token', 'Имя бота'],
    },
    {
        id: 'messenger',
        name: 'Facebook Messenger',
        description: 'Добавьте Facebook Messenger для подключения бота.',
        link: 'https://www.messenger.com/',
        icon: '/service-fbmessenger.svg',
        fields: ['ACCESS TOKEN', 'Page ID'],
    },
    {
        id: 'telegram',
        name: 'Telegram Bot',
        description: 'Добавьте Telegram для подключения бота.',
        link: 'https://core.telegram.org/bots/api',
        icon: '/service-telegram.svg',
        fields: ['Token', 'Имя бота'],
    },
];
