import axios from 'axios';

const API_BASE = '/api';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// JWT token interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('banju-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error handler
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('banju-token');
    }
    return Promise.reject(error);
  },
);

export default client;
