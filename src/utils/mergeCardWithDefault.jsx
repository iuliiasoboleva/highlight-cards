import { defaultCardTemplate } from '../utils/defaultCardInfo';

export const mergeCardWithDefault = (card) => {
  const deepMerge = (defaultObj, overrideObj) => {
    return Object.keys(defaultObj).reduce((acc, key) => {
      if (
        typeof defaultObj[key] === 'object' &&
        defaultObj[key] !== null &&
        !Array.isArray(defaultObj[key])
      ) {
        acc[key] = deepMerge(defaultObj[key], overrideObj[key] || {});
      } else if (Array.isArray(defaultObj[key])) {
        acc[key] = overrideObj[key] !== undefined ? overrideObj[key] : [...defaultObj[key]];
      } else {
        acc[key] = overrideObj.hasOwnProperty(key) ? overrideObj[key] : defaultObj[key];
      }
      return acc;
    }, {});
  };

  return deepMerge(defaultCardTemplate, card);
};
