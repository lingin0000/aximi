import client from './client';

export const poemsApi = {
  list: (params?: Record<string, any>) => client.get('/poems', { params }),
  getById: (id: number) => client.get(`/poems/${id}`),
  getDaily: () => client.get('/poems/daily'),
  getPopular: (count?: number) => client.get('/poems/popular', { params: { count } }),
  search: (q: string, page?: number, pageSize?: number) =>
    client.get('/poems/search', { params: { q, page, pageSize } }),
  getRelated: (id: number) => client.get(`/poems/${id}/related`),
  getAuthors: () => client.get('/poems/authors'),
  getDynasties: () => client.get('/poems/dynasties'),
  getThemes: () => client.get('/poems/themes'),
  getForms: () => client.get('/poems/forms'),
};
