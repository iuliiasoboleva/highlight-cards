import React from 'react';

import Chart from '../../components/Chart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import { ageStats, genderStats } from '../../mocks/portraitMockData';

import './styles.css';
import ClientActivityChart from '../../components/ClientActivityChart';
import ClientsChart from '../../components/ClientsChart';

const Home = () => {
  return (
    <div className="statistics-container">
      <Chart
        title="Статистика аккаунта"
        subtitle="Следите за тем, сколько людей приходит к вам, кто возвращается, и как меняется активность клиентов. Выбирайте удобный период — день, неделя, месяц или год — чтобы видеть полную картину и находить точки роста."
      />
    <ClientsChart/>
      <h2 className="subtitle">Портрет клиента</h2>
      <div className="portrait-chart">
        <ClientPortraitCard title={genderStats.title} data={genderStats.data} />
        <ClientPortraitCard title={ageStats.title} data={ageStats.data} />
      </div>
    </div>
  );
};

export default Home;
