import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// JWT token interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token');
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
      localStorage.removeItem('admin-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default client;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  me: () => client.get('/auth/me'),
};

// Poems API
export const poemsApi = {
  list: (params?: any) => client.get('/poems', { params }),
  getById: (id: number) => client.get(`/poems/${id}`),
  create: (data: any) => client.post('/poems', data),
  update: (id: number, data: any) => client.put(`/poems/${id}`, data),
  delete: (id: number) => client.delete(`/poems/${id}`),
  search: (q: string) => client.get('/poems/search', { params: { q } }),
};

// Users API
export const usersApi = {
  list: (params?: any) => client.get('/users', { params }),
  getById: (id: string) => client.get(`/users/${id}`),
  disable: (id: string) => client.post(`/users/${id}/disable`),
};
