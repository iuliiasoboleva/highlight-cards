import { mergeCardWithDefault } from '../utils/mergeCardWithDefault';
import { statusConfig } from '../utils/statusConfig';

export const hydrateCard = (raw) => {
  if (!raw || raw.id === 'fixed') return raw;

  // нормализуем поля с бэка
  const normalized = {
    ...raw,
    frameUrl: raw.frame_url || raw.frameUrl || '/phone.svg',
    qrImg: raw.qr_img || raw.qrImg,
    urlCopy: raw.url_copy || raw.urlCopy,
  };

  // глубокий мердж + автонейм по статусу, если name пустой
  const merged = mergeCardWithDefault(normalized);

  // сгенерим fieldsName из конфигурации статуса
  merged.fieldsName = (statusConfig[merged.status] || []).map((item) => ({
    type: item.valueKey,
    name: item.label,
  }));

  return merged;
};
