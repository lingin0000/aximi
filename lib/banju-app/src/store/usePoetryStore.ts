import { create } from 'zustand';

interface PoetryCollection {
  id: string;
  name: string;
  poemIds: number[];
  createdAt: number;
}

interface PoetryStore {
  favorites: number[];
  memorized: number[];
  collections: PoetryCollection[];

  toggleFavorite: (poemId: number) => void;
  isFavorite: (poemId: number) => boolean;
  toggleMemorized: (poemId: number) => void;
  isMemorized: (poemId: number) => boolean;

  createCollection: (name: string) => string;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, poemId: number) => void;
  removeFromCollection: (collectionId: string, poemId: number) => void;
}

export const usePoetryStore = create<PoetryStore>((set, get) => ({
  favorites: [],
  memorized: [],
  collections: [],

  toggleFavorite: (poemId) =>
    set((s) => ({
      favorites: s.favorites.includes(poemId)
        ? s.favorites.filter((id) => id !== poemId)
        : [...s.favorites, poemId],
    })),

  isFavorite: (poemId) => get().favorites.includes(poemId),

  toggleMemorized: (poemId) =>
    set((s) => ({
      memorized: s.memorized.includes(poemId)
        ? s.memorized.filter((id) => id !== poemId)
        : [...s.memorized, poemId],
    })),

  isMemorized: (poemId) => get().memorized.includes(poemId),

  createCollection: (name) => {
    const id = `col_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({
      collections: [...s.collections, { id, name, poemIds: [], createdAt: Date.now() }],
    }));
    return id;
  },

  deleteCollection: (id) =>
    set((s) => ({ collections: s.collections.filter((c) => c.id !== id) })),

  addToCollection: (collectionId, poemId) =>
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id === collectionId && !c.poemIds.includes(poemId)
          ? { ...c, poemIds: [...c.poemIds, poemId] }
          : c,
      ),
    })),

  removeFromCollection: (collectionId, poemId) =>
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id === collectionId
          ? { ...c, poemIds: c.poemIds.filter((id) => id !== poemId) }
          : c,
      ),
    })),
}));
