import {
  Check,
  Flame,
  Flower,
  Fuel,
  Gem,
  Heart,
  Scissors,
  Star,
  Ticket,
  Waves,
} from 'lucide-react';

export const stampIcons = [
  { id: 1, name: 'Звезда', value: 'Star', component: Star },
  { id: 2, name: 'Сердце', value: 'Heart', component: Heart },
  { id: 3, name: 'Галочка', value: 'Check', component: Check },
  { id: 4, name: 'Огонь', value: 'Flame', component: Flame },
  { id: 5, name: 'Бриллиант', value: 'Gem', component: Gem },
  { id: 6, name: 'Топливо', value: 'Fuel', component: Fuel },
  { id: 7, name: 'Цветок', value: 'Flower', component: Flower },
  { id: 8, name: 'Ножницы', value: 'Scissors', component: Scissors },
  { id: 9, name: 'Волны', value: 'Waves', component: Waves },
  { id: 10, name: 'Билет', value: 'Ticket', component: Ticket },
];

export const getStampIconComponent = (iconName) => {
  const match = stampIcons.find((item) => item.value === iconName);
  return match?.component || Star;
};
