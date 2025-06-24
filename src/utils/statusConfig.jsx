import { pluralize } from '../helpers/pluralize';

export const statusConfig = {
  certificate: [
    { label: 'Баланс', valueKey: 'balanceMoney', suffix: '₽' },
    { label: 'Имя', valueKey: 'certificateName', suffix: '' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  cashback: [
    { label: 'Баллы', valueKey: 'credits', suffix: '' },
    {
      label: 'Текущий процент кешбэка',
      valueKey: 'cashbackPercent',
      suffix: '%',
    },
    { label: 'Текущий статус кешбэка', valueKey: 'cashbackStatus' },
  ],
  subscription: [
    { label: 'Текущие визиты', valueKey: 'score' },
    { label: 'Всего визитов', valueKey: 'visitsCount' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  stamp: [
    {
      label: 'Осталось до награды',
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
      label: 'Текущий процент скидки',
      valueKey: 'discountPercent',
      suffix: '%',
    },
    {
      label: 'Текущий статус скидки',
      valueKey: 'discountStatus',
      suffix: '',
    },
  ],
};
