import React, { useState } from 'react';

import BalanceModal from './BalanceModal';
import IssueFieldsModal from './IssueFieldsModal';
import LinkCardItem from './LinkCardItem';
import StatCardItem from './StatCardItem';

import './styles.css';

const linkCards = [
  {
    label: 'Ссылка для установки / восстановления карты',
    url: 'https://app.highlightcards.co.uk/getpass/70df4384-5616-49a1-93a1-4be0f1167429',
  },
  {
    label: 'Реферальная ссылка',
    url: 'https://app.highlightcards.co.uk/getpass/70df4384-5616-49a1-93a1-4be0f1167429?ref=123',
  },
];

const defaultStats = [
  { key: 'ltv', label: 'LTV', value: 7, showRightCircle: false },
  {
    key: 'stamps_given',
    label: 'Штампов получено',
    value: 7,
    change: 1,
    showRightCircle: true,
    hasCounter: true,
  },
  { key: 'rewards_got', label: 'Наград начислено', value: '0', change: 0, showRightCircle: true },
  {
    key: 'rewards_available',
    label: 'Наград доступно',
    value: '0',
    change: 0,
    showRightCircle: true,
    hasCounter: true,
  },
  {
    key: 'rewards_received',
    label: 'Наград получено',
    value: '0',
    change: 0,
    showRightCircle: true,
  },
  {
    key: 'last_stamp_received',
    label: 'Последний штамп зачислен',
    value: '14/06/2025',
    showRightCircle: false,
  },
  {
    key: 'last_reward_got',
    label: 'Последняя награда зачислена',
    value: '',
    showRightCircle: false,
  },
  {
    key: 'last_reward_received',
    label: 'Последняя награда получена',
    value: '',
    showRightCircle: false,
  },
  { key: 'total_visits', label: 'Всего визитов', value: 1, change: 1, showRightCircle: true },
  {
    key: 'current_stamps_quantity',
    label: 'Текущее количество штампов',
    value: 7,
    change: 7,
    showRightCircle: true,
  },
  {
    key: 'referral_stamps_quantity',
    label: 'Штампов по реферальной программе',
    value: '0',
    change: 0,
    showRightCircle: true,
  },
  { key: 'segments', label: 'Сегменты', value: ['Установленные карты', 'Держатели Apple Wallet'] },
  {
    key: 'loyalty_level',
    label: 'Уровень лояльности',
    value: 3,
    isRating: true,
    tooltip: 'Показатель активности и вовлеченности клиентов',
  },
  {
    key: 'status',
    label: 'Статус',
    value: 'Установлена',
    valueColor: 'limegreen',
    actionMenu: [
      {
        label: 'Удалить',
        onClick: () => console.log('Удалить статус'),
      },
    ],
    showRightCircle: false,
  },
  {
    key: 'card_number',
    label: 'Серийный номер карты',
    value: '459036-265-550',
    copyable: true,
    showRightCircle: false,
  },
  {
    key: 'device_installed',
    label: 'Установлено в приложении',
    value: 'Apple Wallet',
    showRightCircle: false,
  },
  {
    key: 'valid_until',
    label: 'Дата окончания действия карты',
    value: null,
    isDatePicker: true,
    onDateChange: (date) => console.log(date),
    showRightCircle: false,
  },
  {
    key: 'utm',
    label: 'UTM метка',
    value: 'qr',
    isTag: true,
    showRightCircle: false,
  },
  {
    key: 'card_issue_date',
    label: 'Дата выпуска карты',
    value: '04/06/2025',
    showRightCircle: false,
  },
  {
    key: 'issue_fields',
    label: 'Поля формы выдачи',
    isFormPopup: true,
    value: [
      { label: 'Телефон', type: 'text', value: '71111111111' },
      { label: 'Email', type: 'email', value: 'D@d.ru' },
      { label: 'Имя', type: 'text', value: 'Л' },
      { label: 'Фамилия', type: 'text', value: 'С' },
      { label: 'Дата рождения', type: 'date', value: '2000-05-17' },
    ],
    showRightCircle: false,
  },
];

const StatCard = ({ stats = null, links = null }) => {
  const [modalType, setModalType] = useState(null);
  const [formFields, setFormFields] = useState(null);

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const statsToRender = stats && stats.length ? stats : defaultStats;
  const linksToRender = links && links.length ? links : linkCards;

  return (
    <div className="client-dashboard-wrapper">
      <div className="client-dashboard-stats">
        {statsToRender.map((item) => (
          <StatCardItem
            key={item.key}
            {...item}
            onIncrement={item.hasCounter ? () => handleOpenModal('increase', item.key) : null}
            onDecrement={item.hasCounter ? () => handleOpenModal('decrease', item.key) : null}
            onFormClick={item.isFormPopup ? () => setFormFields(item.value) : null}
          />
        ))}

        {modalType && <BalanceModal type={modalType} onClose={handleCloseModal} />}
        {formFields && (
          <IssueFieldsModal
            fields={formFields}
            onClose={() => setFormFields(null)}
            onSave={(updatedFields) => {
              console.log('Сохранены поля:', updatedFields);
              setFormFields(null);
            }}
          />
        )}
      </div>
      <div className="client-link-wrapper">
        {linksToRender.map((item, index) => (
          <LinkCardItem key={index} url={item.url} label={item.label} />
        ))}
      </div>
    </div>
  );
};

export default StatCard;
