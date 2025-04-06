export const generateData = (period) => {
  const today = new Date();
  let result = [];

  if (period === 'day') {
    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setHours(i, 0, 0, 0);

      result.push({
        date: date.toISOString(),
        visits: Math.floor(Math.random() * 50),
        repeatClients: Math.floor(Math.random() * 20),
        newClients: Math.floor(Math.random() * 30),
      });
    }
  } else {
    let daysCount = 7;
    switch (period) {
      case 'week':
        daysCount = 7;
        break;
      case 'month':
        daysCount = 30;
        break;
      case 'year':
        daysCount = 12;
        break;
      default:
        daysCount = 7;
    }

    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      result.push({
        date: date.toISOString(),
        visits: Math.floor(Math.random() * 50),
        repeatClients: Math.floor(Math.random() * 20),
        newClients: Math.floor(Math.random() * 30),
      });
    }
  }

  return result;
};

export const overallStats = {
  totalVisits: {
    value: 50,
    change: '+10%',
  },
  repeatClients: {
    value: 20,
    change: '+5%',
  },
  lastPeriod: {
    value: 40,
  },
};
