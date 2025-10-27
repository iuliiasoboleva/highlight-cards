import { defaultCardTemplate } from '../utils/defaultCardInfo';

const RUS_BY_STATUS = {
  stamp: 'Штамп',
  discount: 'Скидка',
  cashback: 'Кэшбэк',
  subscription: 'Абонемент',
  certificate: 'Подарочный сертификат',
};

export const mergeCardWithDefault = (raw) => {
  const card = raw || {};

  const deepMerge = (defaultObj, overrideObj = {}) => {
    return Object.keys(defaultObj).reduce((acc, key) => {
      const defVal = defaultObj[key];
      const overVal = overrideObj[key];

      if (Array.isArray(defVal)) {
        acc[key] = overVal !== undefined ? overVal : [...defVal];
        return acc;
      }

      if (defVal && typeof defVal === 'object') {
        acc[key] = deepMerge(defVal, overVal || {});
        return acc;
      }

      acc[key] = Object.prototype.hasOwnProperty.call(overrideObj, key) ? overVal : defVal;
      return acc;
    }, {});
  };

  const merged = deepMerge(defaultCardTemplate, card);

  const hasName = typeof merged.name === 'string' && merged.name.trim().length > 0;
  if (!hasName) {
    const st = (merged.status || '').trim();
    merged.name = RUS_BY_STATUS[st] || defaultCardTemplate?.name || 'Карта';
  }

  if (merged.id && typeof merged.id === 'string' && merged.id !== 'fixed' && merged.id !== 'new') {
    merged.typeReady = true;
    merged.designReady = true;
    merged.settingsReady = true;
    merged.infoReady = true;
  }

  return merged;
};
