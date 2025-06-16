import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown, CreditCard, PlusCircle, Trash2 } from 'lucide-react';

import './styles.css';

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
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
    <div className="ft-toolbar">
      <div className="ft-dropdown" ref={menuRef}>
        <button className="ft-dropdown-button" onClick={() => setMenuOpen((prev) => !prev)}>
          Действия <ChevronDown size={16} />
        </button>

        {menuOpen && (
          <div className="ft-dropdown-menu">
            <div className="ft-dropdown-item" onClick={() => onAction?.('add')}>
              <PlusCircle size={14} style={{ marginRight: 8 }} />
              Добавить клиента
            </div>
            <div className="ft-dropdown-item disabled">
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Удалить клиентов
            </div>
            <div className="ft-dropdown-item disabled">
              <CreditCard size={14} style={{ marginRight: 8 }} />
              Выпустить карты
            </div>
          </div>
        )}
      </div>

      <input
        className="ft-search-input"
        type="text"
        placeholder="Введите ваш запрос"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSearchChange?.(e.target.value);
        }}
      />
    </div>
  );
};

export default TableToolbar;
