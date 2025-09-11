export const normalizeAddr = (s = '') =>
  s
    .toLowerCase()
    .replace(/[«»“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const round5 = (x) => (typeof x === 'number' ? Number(x.toFixed(5)) : null);

export const sameCoords = (a, b) =>
  !!a && !!b && round5(a.lat) === round5(b.lat) && round5(a.lon) === round5(b.lon);

// Форматирование адреса по ГОСТ-подобным сокращениям
export const formatAddress = (raw = '') => {
  if (!raw || typeof raw !== 'string') return '';
  let s = raw
    .replace(/[«»“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = [
    { re: /\b(город|гор\.|г[\.]?)\b/gi, rep: 'г.' },
    { re: /\bпоселок городского типа\b/gi, rep: 'пгт.' },
    { re: /\bрабочий поселок\b/gi, rep: 'рп.' },
    { re: /\bкурортный поселок\b/gi, rep: 'кт.' },
    { re: /\bпоселок\b/gi, rep: 'п.' },
    { re: /\bсело\b/gi, rep: 'с.' },
    { re: /\bдеревня\b/gi, rep: 'д.' },
    { re: /\bстаница\b/gi, rep: 'ст.' },
    { re: /\bхутор\b/gi, rep: 'х.' },
    { re: /\bместечко\b/gi, rep: 'м.' },
    { re: /\bсельское поселение\b/gi, rep: 'с/п.' },
    { re: /\bгородское поселение\b/gi, rep: 'г/п.' },
    { re: /\bулица\b/gi, rep: 'ул.' },
    { re: /\bпроспект\b/gi, rep: 'пр-т' },
    { re: /\bпроезд\b/gi, rep: 'пр-д' },
    { re: /\bпереулок\b/gi, rep: 'пер.' },
    { re: /\bбульвар\b/gi, rep: 'б-р' },
    { re: /\bшоссе\b/gi, rep: 'ш.' },
    { re: /\bаллея\b/gi, rep: 'ал.' },
    { re: /\bнабережная\b/gi, rep: 'наб.' },
    { re: /\bплощадь\b/gi, rep: 'пл.' },
    { re: /\bтупик\b/gi, rep: 'туп.' },
    { re: /\bмикрорайон\b/gi, rep: 'мкр.' },
    { re: /\bквартал\b/gi, rep: 'кв-л' },
    { re: /\bдом\b/gi, rep: 'д.' },
    { re: /\bкорпус\b/gi, rep: 'к.' },
    { re: /\bстроение\b/gi, rep: 'стр.' },
    { re: /\bсооружение\b/gi, rep: 'соор.' },
    { re: /\bвладение\b/gi, rep: 'влд.' },
    { re: /\bлитера\b/gi, rep: 'лит.' },
    { re: /\bквартира\b/gi, rep: 'кв.' },
    { re: /\bофис\b/gi, rep: 'оф.' },
    { re: /\bкомната\b/gi, rep: 'ком.' },
    { re: /\bпомещение\b/gi, rep: 'пом.' },
    { re: /\bобласть\b/gi, rep: 'обл.' },
    { re: /\bрайон\b/gi, rep: 'р-н' },
    { re: /\bреспублика\b/gi, rep: 'респ.' },
  ];

  tokens.forEach(({ re, rep }) => {
    s = s.replace(re, rep);
  });

  s = s.replace(/\s*,\s*/g, ', ');
  s = s.replace(/\s{2,}/g, ' ').trim();
  s = s.replace(/(^|, )([а-яё])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  return s;
};
