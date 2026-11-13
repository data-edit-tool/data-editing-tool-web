import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

// token이 있으면 header에 추가
export const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default instance;
