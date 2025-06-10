export const calculateOverallStats = (data, previousData = []) => {
  const sum = (arr, key) => arr.reduce((acc, item) => acc + (item[key] || 0), 0);

  const current = {
    totalVisits: sum(data, 'visits'),
    repeatClients: sum(data, 'repeatClients'),
    newClients: sum(data, 'newClients'),
    referrals: 0, // если нет поля — оставь 0 или добавь, если появится
  };

  const previous = {
    totalVisits: sum(previousData, 'visits'),
    repeatClients: sum(previousData, 'repeatClients'),
    newClients: sum(previousData, 'newClients'),
    referrals: 0,
  };

  return {
    totalVisits: {
      value: current.totalVisits,
      change: current.totalVisits - previous.totalVisits,
    },
    repeatClients: {
      value: current.repeatClients,
      change: current.repeatClients - previous.repeatClients,
    },
    newClients: {
      value: current.newClients,
      change: current.newClients - previous.newClients,
    },
    referrals: {
      value: current.referrals,
      change: 0,
    },
    lastPeriod: {
      value: previous.totalVisits,
    },
  };
};
