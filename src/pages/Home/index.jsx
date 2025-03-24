import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { generateData, overallStats } from '../../mocks/chartData';
import Chart from '../../components/Chart';
import ClientPortraitCard from '../../components/ClientPortraitCard';
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
    <div className='statistics-container'>
      <Chart
        title="Статистика пользователей"
        generateData={generateData}
        overallStats={overallStats}
        periodLabels={periodLabels}
        periods={periods}
      />
      <h2 className="title">Лояльность</h2>
      <div className='portrait-chart'>
        <ClientPortraitCard
          title="Уровень лояльности"
          value=""
        />
        <ClientPortraitCard
          title="Недовольные клиенты"
          value=""
        />
        <ClientPortraitCard
          title="Гендерное соотношение"
          value=""
        />
        <ClientPortraitCard
          title="Устройства"
          value=""
        />
      </div>
    </div>
  );
};

export default Home;
