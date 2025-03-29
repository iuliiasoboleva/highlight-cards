export const mockTransactions = [
    {
      id: 1,
      userName: "Алексей Иванов",
      dateTime: "2024-06-26 14:32",
      phone: "+7 912 345 67 89",
      device: "iPhone 13",
      template: "Шаблон 1",
      event: "Покупка",
      quantity: "1",
      balance: "100 ₽",
    },
    {
      id: 2,
      userName: "Мария Смирнова",
      dateTime: "2024-06-25 09:15",
      phone: "+7 926 888 00 11",
      device: "Samsung Galaxy S22",
      template: "Шаблон 2",
      event: "Получение бонуса",
      quantity: "2",
      balance: "150 ₽",
    }
  ];
  
export const transactionHeaders = [
    { key: "userName", label: "Имя пользователя" },
    { key: "dateTime", label: "Дата и время" },
    { key: "phone", label: "Телефон" },
    { key: "device", label: "Устройство" },
    { key: "template", label: "Шаблон" },
    { key: "event", label: "Событие" },
    { key: "quantity", label: "Количество" },
    { key: "balance", label: "Баланс" }
  ];
  