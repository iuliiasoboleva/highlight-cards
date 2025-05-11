import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import Chart from '../../components/Chart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
import { generateData, overallStats } from '../../mocks/chartData';
import { deviceStats, genderStats } from '../../mocks/portraitMockData';

import './styles.css';

const periods = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  allTime: 'Все время',
  custom: 'Период',
};

const periodLabels = {
  day: 'день',
  week: 'неделю',
  month: 'месяц',
  year: 'год',
  allTime: 'всё время',
  custom: 'период',
};

const Home = () => {
  return (
    <div className="statistics-container">
      <Chart
        title="Статистика пользователей"
        subtitle="Следите за тем, сколько людей приходит к вам, кто возвращается, и как меняется активность клиентов. Выбирайте удобный период — день, неделя, месяц или год — чтобы видеть полную картину и находить точки роста."
        generateData={generateData}
        overallStats={overallStats}
        periodLabels={periodLabels}
        periods={periods}
      />
      <h2 className="title">Лояльность</h2>
      <div className="portrait-chart">
        <ClientPortraitCard title={genderStats.title} data={genderStats.data} />
        <ClientPortraitCard title={deviceStats.title} data={deviceStats.data} />
      </div>
    </div>
  );
};

export default Home;
