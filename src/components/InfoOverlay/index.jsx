import React from 'react';

import { X } from 'lucide-react';

import {
  CloseButton,
  Content,
  Header,
  Item,
  ItemLabel,
  LinkLabel,
  LinkLine,
  LinkValue,
  Multiline,
  Overlay,
  Title,
  Value,
} from './styles';

// 1) Фиксированный список полей и порядок вывода (whitelist)
const FIELDS_ORDER = [
  'description',
  'howToGetStamp',
  'companyName',
  'rewardDescription',
  'stampMessage',
  'claimRewardMessage',
  'autoRedeem',
  'referralProgramActive',
  'referralMoment',
  'referrerStampsQuantity',
  'referralStampsQuantity',
  'activeLinks',
  'reviewLinks',
  'fullPolicyText',
  'linkToFullTerms',
  'policyEnabled',
  'issuerName',
  'issuerEmail',
  'issuerPhone',
];

const fieldLabels = {
  description: 'Описание карты',
  howToGetStamp: 'Как получить штамп',
  companyName: 'Название компании',
  rewardDescription: 'Описание награды',
  stampMessage: 'Сообщение о штампе',
  claimRewardMessage: 'Сообщение о награде',
  stampsQuantity: 'Количество штампов',
  activeStamp: 'Активный штамп',
  inactiveStamp: 'Неактивный штамп',
  logo: 'Логотип',
  icon: 'Иконка',
  stampBackground: 'Фон штампов',
  // multiRewards: 'Мультинаграды',
  autoRedeem: 'Автосписание награды',
  referralProgramActive: 'Реферальная программа активна',
  referralMoment: 'Момент начисления',
  referrerStampsQuantity: 'Штампы для реферера',
  referralStampsQuantity: 'Штампы для реферала',
  activeLinks: 'Активные ссылки',
  reviewLinks: 'Ссылки на отзывы',
  fullPolicyText: 'Полный текст политики',
  linkToFullTerms: 'Ссылка на полные условия',
  policyEnabled: 'Политика включена',
  issuerName: 'Имя отправителя',
  issuerEmail: 'Email отправителя',
  issuerPhone: 'Телефон отправителя',
};

const valueFormatters = {
  autoRedeem: (v) => (v ? 'Да' : 'Нет'),
  referralProgramActive: (v) => (v ? 'Да' : 'Нет'),
  referralMoment: (v) => (v === 'visit' ? 'Первого визита' : v === 'issue' ? 'Выдачи карты' : v),
  policyEnabled: (v) => (v ? 'Да' : 'Нет'),
  activeLinks: (v) =>
    Array.isArray(v) && v.length
      ? v.map((link) => `${link.text || 'Без названия'} → ${link.link || '—'}`).join('\n')
      : '',
  reviewLinks: (v) =>
    Array.isArray(v) && v.length
      ? v
          .map((link) => `${link.text || 'Без названия'} (${link.type}): ${link.link || '—'}`)
          .join('\n')
      : '',
};

const toDisplay = (key, raw) => {
  const isEmpty =
    raw === null ||
    raw === undefined ||
    (typeof raw === 'string' && raw.trim() === '') ||
    (Array.isArray(raw) && raw.length === 0);

  if (isEmpty) return 'Нет данных';

  const formatted = valueFormatters[key]
    ? valueFormatters[key](raw)
    : Array.isArray(raw)
      ? raw.join(', ')
      : String(raw);

  return formatted && String(formatted).trim() !== '' ? formatted : 'Нет данных';
};

const InfoOverlay = ({ infoFields, onClose, onFieldClick }) => {
  if (!infoFields) return null;

  return (
    <Overlay>
      <Header>
        <Title>Информация</Title>
        <CloseButton aria-label="Закрыть" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </Header>

      <Content>
        {FIELDS_ORDER.map((key) => {
          const label = fieldLabels[key] || key;
          const displayValue = toDisplay(key, infoFields[key]);
          const isMultiline = String(displayValue).includes('\n');

          return (
            <Item key={key}>
              <ItemLabel>{label}:</ItemLabel>

              {isMultiline ? (
                <Multiline onClick={() => onFieldClick && onFieldClick(key)}>
                  {String(displayValue)
                    .split('\n')
                    .map((line, i) => {
                      const [labelPart, linkPart] = line.split(/ → |: /);
                      return (
                        <LinkLine key={`${key}-${i}`}>
                          <LinkLabel>{labelPart}</LinkLabel>
                          {linkPart && <LinkValue title={linkPart}>{linkPart}</LinkValue>}
                        </LinkLine>
                      );
                    })}
                </Multiline>
              ) : (
                <Value title={displayValue} onClick={() => onFieldClick && onFieldClick(key)}>
                  {displayValue}
                </Value>
              )}
            </Item>
          );
        })}
      </Content>
    </Overlay>
  );
};

export default InfoOverlay;
