export const calculateOverallStats = (data, previousData = [], previousPreviousData = []) => {
  const sum = (arr, key) => arr.reduce((acc, item) => acc + (item[key] || 0), 0);

  const current = {
    totalVisits: sum(data, 'visits'),
    repeatClients: sum(data, 'repeatClients'),
    newClients: sum(data, 'newClients'),
    referrals: 0,
  };

  const previous = {
    totalVisits: sum(previousData, 'visits'),
    repeatClients: sum(previousData, 'repeatClients'),
    newClients: sum(previousData, 'newClients'),
    referrals: 0,
  };

  const previousPrevious = {
    totalVisits: sum(previousPreviousData, 'visits'),
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
      change: previous.totalVisits - previousPrevious.totalVisits,
    },
  };
};
