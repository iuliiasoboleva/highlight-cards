import React, { useEffect, useRef, useState } from 'react';

import axiosInstance from '../../axiosInstance';

const DADATA_TOKEN = process.env.REACT_APP_DADATA_TOKEN || '';

const InnSuggestInput = ({
  value,
  onChange,
  onSelect,
  onBlur,
  placeholder = 'ИНН или название компании',
  inputClass = 'custom-input',
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (DADATA_TOKEN) {
          // прямой запрос к DaData
          const res = await fetch(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Token ${DADATA_TOKEN}`,
              },
              body: JSON.stringify({ query, count: 10 }),
            },
          );
          if (!res.ok) return;
          const data = await res.json();
          setSuggestions(data?.suggestions || []);
        } else {
          // запрос через бекенд, токен там
          const res = await axiosInstance.get('/company/suggest', { params: { query } });
          setSuggestions(
            (res.data || []).map((item) => ({ value: item.value, data: { inn: item.inn } })),
          );
        }
        setShowDropdown(true);
      } catch {
        // ignore
      }
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (onChange) onChange(text);
  };

  const handleSelect = (item) => {
    setShowDropdown(false);
    setSuggestions([]);
    setQuery(item.data.inn);
    if (onSelect) onSelect(item);
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={(e) => {
          setTimeout(() => setShowDropdown(false), 200);
          if (onBlur) onBlur(e);
        }}
        placeholder={placeholder}
        className={inputClass}
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #dcdcdc',
            borderRadius: 8,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {suggestions.map((s) => (
            <div
              key={s.data.inn + s.value}
              onClick={() => handleSelect(s)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div style={{ fontWeight: 500 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{s.data.inn}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InnSuggestInput;
