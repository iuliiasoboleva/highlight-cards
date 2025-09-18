import React, { useEffect, useMemo, useRef, useState } from 'react';

import CustomInput from '../../../customs/CustomInput';

const DADATA_TOKEN = process.env.REACT_APP_DADATA_TOKEN || '';

const fallbackCities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Ростов-на-Дону',
  'Уфа',
  'Красноярск',
  'Владивосток',
];

const CitySuggestInput = ({ value, onChange, className }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      try {
        if (DADATA_TOKEN) {
          const res = await fetch(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Token ${DADATA_TOKEN}`,
              },
              body: JSON.stringify({ query, count: 8, to_bound: { value: 'city' } }),
            },
          );
          if (res.ok) {
            const data = await res.json();
            const options = (data?.suggestions || [])
              .map((s) => s.data?.city || s.data?.settlement || s.value)
              .filter(Boolean);
            setSuggestions(options);
          } else {
            setSuggestions([]);
          }
        } else {
          const low = query.toLowerCase();
          const options = fallbackCities.filter((c) => c.toLowerCase().includes(low));
          setSuggestions(options);
        }
        setOpen(true);
      } catch {
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(debRef.current);
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handlePick = (city) => {
    setOpen(false);
    setQuery(city);
    onChange?.(city);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }} className={className}>
      <CustomInput
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange?.(v);
        }}
        placeholder="Начните вводить город"
      />
      {open && suggestions.length > 0 && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #dcdcdc',
            borderRadius: 8,
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            maxHeight: 220,
            overflowY: 'auto',
            zIndex: 20,
          }}
        >
          {suggestions.map((opt) => (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: 'transparent',
                border: 0,
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySuggestInput;
