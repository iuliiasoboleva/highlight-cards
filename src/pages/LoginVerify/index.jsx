import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { setUser } from '../../store/userSlice';
import { setCookie } from '../../cookieUtils';

const LoginVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/auth');
      return;
    }

    const verify = async () => {
      try {
        const res = await axiosInstance.post('auth/magic-link-verify', { token });

        // Если бэкенд начнёт отдавать JWT, сохраним его в cookie
        if (res.data?.token) {
          setCookie('userToken', res.data.token, 14);
        }

        dispatch(setUser(res.data));
        navigate('/');
      } catch (err) {
        navigate('/auth');
      }
    };

    verify();
  }, [dispatch, navigate, searchParams]);

  return <p style={{ textAlign: 'center', marginTop: '40px' }}>Проверяем ссылку...</p>;
};

export default LoginVerify; 