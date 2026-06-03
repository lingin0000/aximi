import client from './client';

export const authApi = {
  register: (username: string, email: string, password: string) =>
    client.post('/auth/register', { username, email, password }),

  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),

  me: () => client.get('/auth/me'),
};
