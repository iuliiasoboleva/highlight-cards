import { pluralize } from '../helpers/pluralize';

export const statusConfig = {
  certificate: [
    { label: 'Баллы', valueKey: 'balanceMoney', suffix: '₽' },
    { label: 'Имя', valueKey: 'certificateName', suffix: '' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  cashback: [
    { label: 'Баллы', valueKey: 'credits', suffix: '' },
    {
      label: '% кешбэка',
      valueKey: 'cashbackPercent',
      suffix: '%',
    },
    { label: 'Владелец карты', valueKey: 'cashbackStatus' },
  ],
  subscription: [
    { label: 'Текущие визиты', valueKey: 'score' },
    { label: 'Всего визитов', valueKey: 'visitsCount' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  stamp: [
    {
      label: 'До награды',
      valueKey: 'restStamps',
      format: (value) => `${value} ${pluralize(value, ['штамп', 'штампа', 'штампов'])}`,
    },
    {
      label: 'Доступные награды',
      valueKey: 'rewards',
      format: (value) => `${value} ${pluralize(value, ['награда', 'награды', 'наград'])}`,
    },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  discount: [
    {
      label: 'Скидка',
      valueKey: 'discountPercent',
      suffix: '%',
    },
    {
      label: 'Статус',
      valueKey: 'discountStatus',
      suffix: '',
    },
  ],
};

export const cardTypeDescriptions = {
  stamp: 'Собирайте штампы для получения наград',
  discount: 'Делайте покупки, увеличивайте скидку',
  cashback: 'Получайте бонусные баллы за каждую покупку',
  subscription: 'Проходите услуги и получайте бонусные баллы',
  certificate: 'Название акции',
};
