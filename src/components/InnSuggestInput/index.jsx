import React, { useEffect, useRef, useState } from 'react';

import axiosInstance from '../../axiosInstance';
import CustomInput from '../../customs/CustomInput';
import { Container, Dropdown, Item, ItemSub, ItemTitle } from './styles';

const DADATA_TOKEN = process.env.REACT_APP_DADATA_TOKEN || '';

const InnSuggestInput = ({
  value,
  onChange,
  onSelect,
  onBlur,
  placeholder = 'ИНН или название компании',
  inputClass = 'custom-input',
  className,
  $error,
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
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (DADATA_TOKEN) {
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

    return () => clearTimeout(debounceRef.current);
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
    onChange?.(text);
  };

  const handleSelect = (item) => {
    setShowDropdown(false);
    setSuggestions([]);
    setQuery(item.data.inn);
    onSelect?.(item);
  };

  return (
    <Container ref={containerRef} className={className}>
      <CustomInput
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={(e) => {
          setTimeout(() => setShowDropdown(false), 200);
          onBlur?.(e);
        }}
        placeholder={placeholder}
        className={inputClass}
        $error={$error}
      />

      {showDropdown && suggestions.length > 0 && (
        <Dropdown>
          {suggestions.map((s) => (
            <Item key={s.data.inn + s.value} onClick={() => handleSelect(s)}>
              <ItemTitle>{s.value}</ItemTitle>
              <ItemSub>{s.data.inn}</ItemSub>
            </Item>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};

export default InnSuggestInput;
