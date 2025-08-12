import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { setCookie } from '../../cookieUtils';
import { setUser } from '../../store/userSlice';
import { Note, Spinner, VerifyLogo, VerifyWrapper } from './styles';

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
      } catch {
        navigate('/auth');
      }
    };

    verify();
    called.current = true;
  }, [dispatch, navigate, searchParams]);

  return (
    <VerifyWrapper>
      <VerifyLogo
        src="https://optim.tildacdn.com/tild6639-6664-4537-b134-353639383763/-/resize/86x/-/format/webp/svg.png.webp"
        alt="Loyal Club"
      />
      <Spinner role="status" aria-label="загрузка" />
      <Note>Проверяем ссылку...</Note>
    </VerifyWrapper>
  );
};

export default LoginVerify;
