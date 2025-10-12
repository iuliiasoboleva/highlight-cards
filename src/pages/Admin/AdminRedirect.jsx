import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default AdminRedirect;

