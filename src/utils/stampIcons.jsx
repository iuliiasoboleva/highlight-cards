import { Check, Flame, Gem, Heart, Star, Ticket } from 'lucide-react';

import { ReactComponent as AsianIcon } from '../assets/icons/asian.svg';
import { ReactComponent as BarIcon } from '../assets/icons/bar.svg';
import { ReactComponent as BarberIcon } from '../assets/icons/barber.svg';
import { ReactComponent as BreakfastIcon } from '../assets/icons/breakfast.svg';
import { ReactComponent as BrowIcon } from '../assets/icons/brow.svg';
import { ReactComponent as BurgerIcon } from '../assets/icons/burger.svg';
import { ReactComponent as CafeIcon } from '../assets/icons/cafe.svg';
import { ReactComponent as CarWashIcon } from '../assets/icons/carwash.svg';
import { ReactComponent as CinemaIcon } from '../assets/icons/cinema.svg';
import { ReactComponent as CleaningIcon } from '../assets/icons/cleaning.svg';
import { ReactComponent as CoffeeIcon } from '../assets/icons/coffee.svg';
import { ReactComponent as CoworkingIcon } from '../assets/icons/coworking.svg';
import { ReactComponent as DentalIcon } from '../assets/icons/dental.svg';
import { ReactComponent as DepilationIcon } from '../assets/icons/depilation.svg';
import { ReactComponent as EyelashIcon } from '../assets/icons/eyelash.svg';
import { ReactComponent as FishIcon } from '../assets/icons/fish.svg';
import { ReactComponent as FitnessIcon } from '../assets/icons/fitness.svg';
import { ReactComponent as FloralIcon } from '../assets/icons/floral.svg';
import { ReactComponent as GymIcon } from '../assets/icons/gym.svg';
import { ReactComponent as HaircutIcon } from '../assets/icons/haircut.svg';
import { ReactComponent as HookahIcon } from '../assets/icons/hookah.svg';
import { ReactComponent as HotelIcon } from '../assets/icons/hotel.svg';
import { ReactComponent as KebabIcon } from '../assets/icons/kebab.svg';
import { ReactComponent as LaundryIcon } from '../assets/icons/laundry.svg';
import { ReactComponent as LunchIcon } from '../assets/icons/lunch.svg';
import { ReactComponent as MakeupIcon } from '../assets/icons/makeup.svg';
import { ReactComponent as ManicureIcon } from '../assets/icons/manicure.svg';
import { ReactComponent as MassageIcon } from '../assets/icons/massage.svg';
import { ReactComponent as PastryIcon } from '../assets/icons/pastry.svg';
import { ReactComponent as PizzaIcon } from '../assets/icons/pizza.svg';
import { ReactComponent as PoolIcon } from '../assets/icons/pool.svg';
import { ReactComponent as QuestIcon } from '../assets/icons/quest.svg';
import { ReactComponent as RentCarIcon } from '../assets/icons/rentcar.svg';
import { ReactComponent as RestaurantIcon } from '../assets/icons/restaurant.svg';
import { ReactComponent as SPAIcon } from '../assets/icons/spa.svg';
import { ReactComponent as SunroomIcon } from '../assets/icons/sunroom.svg';
import { ReactComponent as SushiIcon } from '../assets/icons/sushi.svg';

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
  { id: 15, name: 'Кофейня', value: 'Coffee', component: CoffeeIcon },
  { id: 16, name: 'Восточная кухня', value: 'Asian', component: AsianIcon },
  { id: 17, name: 'Депиляция', value: 'Depilation', component: DepilationIcon },
  { id: 18, name: 'Завтрак', value: 'Breakfast', component: BreakfastIcon },
  { id: 19, name: 'Кальянная', value: 'Hookah', component: HookahIcon },
  { id: 20, name: 'Квесты', value: 'Quest', component: QuestIcon },
  { id: 21, name: 'Кафе', value: 'Cafe', component: CafeIcon },
  { id: 22, name: 'Кинотеатр', value: 'Cinema', component: CinemaIcon },
  { id: 23, name: 'Клининг', value: 'Cleaning', component: CleaningIcon },
  { id: 24, name: 'Коворкинг', value: 'Coworking', component: CoworkingIcon },
  { id: 25, name: 'Кондитерская', value: 'Pastry', component: PastryIcon },
  { id: 26, name: 'Макияж', value: 'Makeup', component: MakeupIcon },
  { id: 27, name: 'Маникюр', value: 'Manicure', component: ManicureIcon },
  { id: 28, name: 'Массаж', value: 'Massage', component: MassageIcon },
  { id: 29, name: 'Отель', value: 'Hotel', component: HotelIcon },
  { id: 30, name: 'Пиццерия', value: 'Pizza', component: PizzaIcon },
  { id: 31, name: 'Ресторан', value: 'Restaurant', component: RestaurantIcon },
  { id: 32, name: 'Рыбный ресторан', value: 'Fish', component: FishIcon },
  { id: 33, name: 'Солярий', value: 'Sunroom', component: SunroomIcon },
  { id: 34, name: 'Спортзал', value: 'Gym', component: GymIcon },
  { id: 35, name: 'Стоматология', value: 'Dental', component: DentalIcon },
  { id: 36, name: 'Стрижка', value: 'Haircut', component: HaircutIcon },
  { id: 37, name: 'Суши', value: 'Sushi', component: SushiIcon },
  { id: 38, name: 'Брови', value: 'Brow', component: BrowIcon },
  { id: 39, name: 'Ресницы', value: 'Eyelash', component: EyelashIcon },
  { id: 40, name: 'Фитнес', value: 'Fitness', component: FitnessIcon },
  { id: 41, name: 'Химчистка', value: 'Laundry', component: LaundryIcon },
  { id: 42, name: 'Цветочный', value: 'Floral', component: FloralIcon },
  { id: 43, name: 'Шаурма', value: 'Kebab', component: KebabIcon },
];

export const getStampIconComponent = (iconName) => {
  const match = stampIcons.find((item) => item.value === iconName);
  return match?.component || Star;
};
