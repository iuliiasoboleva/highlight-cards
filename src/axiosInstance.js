import axios from 'axios';

import BASE_URL from './config';
import { getCookie } from './cookieUtils';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('userToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.response = { data: { detail: 'Не удалось подключиться к серверу. Попробуйте позже.' } };
    } else {
      const { data, status } = error.response;

      if (typeof data === 'string' && data.startsWith('<')) {
        error.response.data = {
          detail:
            status === 504
              ? 'Сервер не ответил вовремя. Попробуйте позже.'
              : 'Произошла ошибка на сервере. Попробуйте позже.',
        };
      }
    }

    return Promise.reject(error);
  },
);
