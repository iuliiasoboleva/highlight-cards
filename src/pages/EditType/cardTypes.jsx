import { BadgePercent, DollarSign, Gift, Stamp, Ticket } from 'lucide-react';

export const cardTypes = [
  {
    id: 'stamp',
    name: 'Штамп',
    icon: Stamp,
    tag: 'high',
    desc: 'Собирайте визиты — и дарите бонус',
  },
  {
    id: 'discount',
    name: 'Скидка',
    icon: BadgePercent,
    tag: 'high',
    desc: 'Автоматическая скидка по карте',
  },
  {
    id: 'cashback',
    name: 'Кэшбэк',
    icon: DollarSign,
    tag: 'high',
    desc: 'Накопление % от суммы чека',
  },
  {
    id: 'subscription',
    name: 'Абонемент',
    icon: Ticket,
    tag: 'shop',
    desc: 'Фиксированное число посещений',
  },
  {
    id: 'certificate',
    name: 'Подарочный сертификат',
    icon: Gift,
    tag: 'shop',
    desc: 'Карта с фиксированной суммой',
  },
];
