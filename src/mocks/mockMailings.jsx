
export const mailingsHeaders = [
    { key: "name", label: "НАЗВАНИЕ" },
    { key: "dateTime", label: "ДАТА СОЗДАНИЯ" },
    { key: "recipients", label: "ПОЛУЧАТЕЛИ" },
    { key: "mailingType", label: "ТИП РАССЫЛКИ" },
    { key: "status", label: "СТАТУС" },
];

export const mockMailings = [
    {
      name: "Весенняя акция",
      dateTime: "2024-03-25 14:30",
      recipients: "145 клиентов",
      mailingType: "Push",
      status: "Запланирована",
    },
    {
      name: "Напоминание об оплате",
      dateTime: "2024-03-20 09:00",
      recipients: "98 клиентов",
      mailingType: "SMS",
      status: "Отправлена",
    },
    {
      name: "Поздравление с праздником",
      dateTime: "2024-03-08 10:15",
      recipients: "все клиенты",
      mailingType: "Email",
      status: "Черновик",
    },
    {
      name: "Скидки на выходных",
      dateTime: "2024-03-29 18:00",
      recipients: "215 клиентов",
      mailingType: "Push и Email",
      status: "Ошибка",
    },
  ];
  