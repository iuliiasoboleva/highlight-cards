import { Check, Flame, Gem, Heart, Star, Ticket } from 'lucide-react';

import AsianIcon from '../components/icons/AsianIcon';
import BarIcon from '../components/icons/BarIcon';
import BarberIcon from '../components/icons/BarberIcon';
import BurgerIcon from '../components/icons/BurgerIcon';
import CarWashIcon from '../components/icons/CarWashIcon';
import CoffeeIcon from '../components/icons/CoffeeIcon';
import LunchIcon from '../components/icons/LunchIcon';
import PoolIcon from '../components/icons/PoolIcon';
import RentCarIcon from '../components/icons/RentCarIcon';
import SPAIcon from '../components/icons/SPAIcon';

export const stampIcons = [
  { id: 1, name: 'Звезда', value: 'Star', component: Star },
  { id: 2, name: 'Сердце', value: 'Heart', component: Heart },
  { id: 3, name: 'Галочка', value: 'Check', component: Check },
  { id: 4, name: 'Огонь', value: 'Flame', component: Flame },
  { id: 5, name: 'Бриллиант', value: 'Gem', component: Gem },
  { id: 6, name: 'Автомойка', value: 'CarWash', component: CarWashIcon },
  { id: 7, name: 'СПА', value: 'SPA', component: SPAIcon },
  { id: 8, name: 'Аренда авто', value: 'RentCar', component: RentCarIcon },
  { id: 9, name: 'Бассейн', value: 'Pool', component: PoolIcon },
  { id: 10, name: 'Билет', value: 'Ticket', component: Ticket },
  { id: 11, name: 'Бар', value: 'Bar', component: BarIcon },
  { id: 12, name: 'Барбершоп', value: 'Barbershop', component: BarberIcon },
  { id: 13, name: 'Бизнес-ланч', value: 'Lunch', component: LunchIcon },
  { id: 14, name: 'Бургерная', value: 'Burger', component: BurgerIcon },
  { id: 15, name: 'Ваша кофейня', value: 'Coffee', component: CoffeeIcon },
  { id: 16, name: 'Восточная кухня', value: 'Asian', component: AsianIcon },
];

export const getStampIconComponent = (iconName) => {
  const match = stampIcons.find((item) => item.value === iconName);
  return match?.component || Star;
};
