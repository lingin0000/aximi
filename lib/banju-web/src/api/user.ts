import client from './client';

export const userApi = {
  toggleFavorite: (poemId: number) => client.post(`/user/favorites/${poemId}`),
  getFavorites: () => client.get('/user/favorites'),

  toggleMemorized: (poemId: number) => client.post(`/user/memorized/${poemId}`),
  getMemorized: () => client.get('/user/memorized'),

  getCollections: () => client.get('/user/collections'),
  createCollection: (name: string) => client.post('/user/collections', { name }),
  deleteCollection: (id: string) => client.delete(`/user/collections/${id}`),
  addToCollection: (collectionId: string, poemId: number) =>
    client.post(`/user/collections/${collectionId}/poems`, { poemId }),
  removeFromCollection: (collectionId: string, poemId: number) =>
    client.delete(`/user/collections/${collectionId}/poems/${poemId}`),
};
