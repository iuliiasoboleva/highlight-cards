import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown, CreditCard, PlusCircle, Trash2 } from 'lucide-react';

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  SearchInput,
  Toolbar,
} from './styles';

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler?.();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

const TableToolbar = ({ onSearchChange, onAction }) => {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => setMenuOpen(false));

  return (
    <Toolbar>
      <Dropdown ref={menuRef}>
        <DropdownButton type="button" onClick={() => setMenuOpen((p) => !p)}>
          Действия <ChevronDown size={16} />
        </DropdownButton>

        {menuOpen && (
          <DropdownMenu>
            <DropdownItem onClick={() => onAction?.('add')}>
              <PlusCircle size={14} style={{ marginRight: 8 }} />
              Добавить клиента
            </DropdownItem>
            <DropdownItem disabled>
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Удалить клиентов
            </DropdownItem>
            <DropdownItem disabled>
              <CreditCard size={14} style={{ marginRight: 8 }} />
              Выпустить карты
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <SearchInput
        type="text"
        placeholder="Введите ваш запрос"
        value={searchValue}
        onChange={(e) => {
          const v = e.target.value;
          setSearchValue(v);
          onSearchChange?.(v);
        }}
      />
    </Toolbar>
  );
};

export default TableToolbar;
