import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import Chart from '../../components/Chart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import ClientsChart from '../../components/ClientsChart';
import DashboardStats from '../../components/DashboardStats';
import RetentionChart from '../../components/RetentionChart';

import './styles.css';

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

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="statistics-container">
      {/* Графики пока на мок-данных, как раньше */}
      <Chart
        title="Статистика карты"
        subtitle="Следите за активностью клиентов по данной карте."
        externalData={series.map((p) => ({
          date: p.date,
          visits: p.visits,
          newClients: p.newClients,
          repeatClients: p.visits - p.newClients,
        }))}
      />
      <ClientsChart
        externalData={series.map((p) => ({
          date: p.date,
          newClients: p.newClients,
          cardsIssued: p.visits,
        }))}
      />
      <RetentionChart externalData={retention} />

      <h2 className="subtitle">Портрет клиента</h2>
      <div className="portrait-chart">
        <ClientPortraitCard
          title="Гендерное соотношение"
          data={Object.entries(portrait.gender).map(([key, val]) => ({ name: key, value: val }))}
        />
        <ClientPortraitCard
          title="Возраст"
          data={Object.entries(portrait.age).map(([key, val]) => ({ name: key, value: val }))}
        />
      </div>
    </div>
  );
};

export default CardStats;
