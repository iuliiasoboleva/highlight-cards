import { Check, Flame, Gem, Heart, Star } from 'lucide-react';

export const stampIcons = [
  { id: 1, name: 'Звезда', value: 'Star', component: Star },
  { id: 2, name: 'Сердце', value: 'Heart', component: Heart },
  { id: 3, name: 'Галочка', value: 'Check', component: Check },
  { id: 4, name: 'Огонь', value: 'Flame', component: Flame },
  { id: 5, name: 'Бриллиант', value: 'Gem', component: Gem },
];

export const getStampIconComponent = (iconName) => {
  const match = stampIcons.find((item) => item.value === iconName);
  return match ? match.component : Star;
};
