import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import Chart from '../../components/Chart';
import ClientsChart from '../../components/Chart/ClientsChart';
import RetentionChart from '../../components/Chart/RetentionChart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import LoaderCentered from '../../components/LoaderCentered';
import { PortraitGrid, StatisticsContainer, Subtitle } from './styles';

const CardStats = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [retention, setRetention] = useState([]);
  const [portrait, setPortrait] = useState({ gender: {}, age: {} });

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/cards/${id}/stats`);
        setStats(res.data);

        const ts = await axiosInstance.get(`/cards/${id}/stats/series`);
        setSeries(ts.data.points);

        const ret = await axiosInstance.get(`/cards/${id}/stats/retention`);
        setRetention(ret.data.points);

        const port = await axiosInstance.get(`/cards/${id}/stats/portrait`);
        setPortrait(port.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoaderCentered />;

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
    <StatisticsContainer>
      <Chart
        title="Статистика карты"
        subtitle="Следите за активностью клиентов по данной карте."
        externalData={chartData}
      />

      <ClientsChart externalData={activityData} />

      <RetentionChart externalData={retention} />

      <Subtitle>Портрет клиента</Subtitle>
      <PortraitGrid>
        <ClientPortraitCard
          title="Гендерное соотношение"
          data={Object.entries(portrait.gender)
            .filter(([name, value]) => value > 0)
            .map(([name, value]) => ({
              label: name === 'male' ? 'Мужской' : name === 'female' ? 'Женский' : 'Не указан',
              value,
            }))}
        />
        <ClientPortraitCard
          title="Возраст"
          data={Object.entries(portrait.age).map(([name, value]) => ({ label: name, value }))}
        />
      </PortraitGrid>
    </StatisticsContainer>
  );
};

export default CardStats;
