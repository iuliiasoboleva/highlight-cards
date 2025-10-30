import axios from 'axios';

import BASE_URL from './config';

const adminAxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

adminAxiosInstance.interceptors.response.use(
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

export default adminAxiosInstance;
