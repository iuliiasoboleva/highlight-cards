import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { setUser } from '../../store/userSlice';
import { setCookie } from '../../cookieUtils';

import './styles.css';

const LoginVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
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
          localStorage.setItem('quickJwt', res.data.token);
        }

        dispatch(setUser(res.data));
        navigate('/');
      } catch (err) {
        navigate('/auth');
      }
    };

    verify();
    called.current = true;
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="verify-wrapper">
      <img
        src="https://optim.tildacdn.com/tild6639-6664-4537-b134-353639383763/-/resize/86x/-/format/webp/svg.png.webp"
        alt="Loyal Club"
        className="verify-logo"
      />
      <div className="spinner" />
      <p style={{color:'#555'}}>Проверяем ссылку...</p>
    </div>
  );
};

export default LoginVerify; 