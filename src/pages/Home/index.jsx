import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import Chart from '../../components/Chart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import ClientsChart from '../../components/ClientsChart';
import LoaderCentered from '../../components/LoaderCentered';
import RetentionChart from '../../components/RetentionChart';

import './styles.css';

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

  if (loading) {
    return <LoaderCentered />;
  }

  const chartData = series.map((p) => ({
    date: p.date,
    visits: p.visits,
    newClients: p.newClients,
    repeatClients: p.visits - p.newClients,
  }));

  const activityData = series.map((p) => ({
    date: p.date,
    newClients: p.newClients,
    cardsIssued: p.visits,
  }));

  return (
    <div className="statistics-container">
      <Chart
        title="Статистика аккаунта"
        subtitle="Следите за тем, сколько людей приходит к вам, кто возвращается, и как меняется активность клиентов."
        externalData={chartData}
      />
      <ClientsChart externalData={activityData} />
      <RetentionChart externalData={retention} />
      <h2 className="subtitle">Портрет клиента</h2>
      <div className="portrait-chart">
        <ClientPortraitCard
          title="Гендерное соотношение"
          data={Object.entries(portrait.gender).map(([name, value]) => ({ name, value }))}
        />
        <ClientPortraitCard
          title="Возраст"
          data={Object.entries(portrait.age).map(([name, value]) => ({ name, value }))}
        />
      </div>
    </div>
  );
};

export default Home;
