import { useEffect } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { getCookie } from '../cookieUtils';
import { fetchUserData } from '../store/userSlice';

const AuthRedirectGuard = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const token = getCookie('userToken');

  const isPublic =
    ['/auth', '/login', '/sms-code', '/set-pin'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-pin');

  useEffect(() => {
    if (token && !user.email) {
      dispatch(fetchUserData());
    }
  }, [dispatch, token, user.email]);

  if (!token && !isPublic) {
    return <Navigate to="/auth" replace />;
  }

  if (token && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirectGuard;
