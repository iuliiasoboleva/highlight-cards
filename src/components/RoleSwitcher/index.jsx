import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UserCircle } from 'lucide-react';

import { toggleRole } from '../../store/userSlice';

const RoleSwitcher = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);

  const handleToggle = () => {
    dispatch(toggleRole());
  };

  return (
    <div style={{ position: 'absolute', top: 20, right: 20 }}>
      <button
        onClick={handleToggle}
        style={{
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '20px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '12px',
        }}
        title={`Сменить роль (сейчас: ${role})`}
      >
        <UserCircle size={16} style={{ marginRight: 6 }} />
        {role === 'admin' ? 'Admin' : 'Employee'}
      </button>
    </div>
  );
};

export default RoleSwitcher;
