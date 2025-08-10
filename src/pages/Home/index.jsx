import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance.js';
import Chart from '../../components/Chart';
import ClientsChart from '../../components/Chart/ClientsChart.jsx';
import RetentionChart from '../../components/Chart/RetentionChart.jsx';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import LoaderCentered from '../../components/LoaderCentered/index.jsx';
import { toNum } from '../../helpers/date.jsx';
import { PortraitChart, StatisticsContainer, Subtitle } from './styles.jsx';

const Home = () => {
  const user = useSelector((state) => state.user);
  const orgId = user.organization_id;

  const [series, setSeries] = useState([]);
  const [retention, setRetention] = useState([]);
  const [portrait, setPortrait] = useState({ gender: {}, age: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    (async () => {
      try {
        const [seriesRes, retRes, portRes] = await Promise.all([
          axiosInstance.get('/org-stats/series', { params: { organization_id: orgId } }),
          axiosInstance.get('/org-stats/retention', { params: { organization_id: orgId } }),
          axiosInstance.get('/org-stats/portrait', { params: { organization_id: orgId } }),
        ]);

        setSeries(seriesRes.data.points);
        setRetention(retRes.data.points);
        setPortrait(portRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId]);

  const chartData = useMemo(() => {
    return (series || []).map((p) => {
      const visits = toNum(p.visits ?? p.total ?? p.count ?? 0);
      const newClients = toNum(p.newClients ?? p.new ?? p.new_count ?? 0);

      // если visits меньше newClients — берём 0
      const repeatClients = Math.max(0, toNum(p.repeatClients ?? visits - newClients));

      return {
        date: p.date,
        visits,
        newClients,
        repeatClients,
      };
    });
  }, [series]);

  const activityData = useMemo(() => {
    return (series || []).map((p) => ({
      date: p.date,
      newClients: toNum(p.newClients ?? p.new ?? p.new_count ?? 0),
      cardsIssued: toNum(p.visits ?? p.total ?? p.count ?? 0),
    }));
  }, [series]);

  if (loading) {
    return <LoaderCentered />;
  }

  return (
    <StatisticsContainer>
      <Chart
        title="Статистика аккаунта"
        subtitle="Следите за тем, сколько людей приходит к вам, кто возвращается, и как меняется активность клиентов."
        externalData={chartData}
      />
      <ClientsChart externalData={activityData} />
      <RetentionChart externalData={retention} />

      <Subtitle>Портрет клиента</Subtitle>
      <PortraitChart>
        <ClientPortraitCard
          title="Гендерное соотношение"
          data={Object.entries(portrait.gender).map(([name, value]) => ({ name, value }))}
        />
        <ClientPortraitCard
          title="Возраст"
          data={Object.entries(portrait.age).map(([name, value]) => ({ name, value }))}
        />
      </PortraitChart>
    </StatisticsContainer>
  );
};

export default Home;
