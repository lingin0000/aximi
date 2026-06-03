import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PoetryCollection {
  id: string
  name: string
  poemIds: number[]
  createdAt: number
}

interface PoetryStore {
  // 收藏
  favorites: number[]
  memorized: number[]
  toggleFavorite: (poemId: number) => void
  isFavorite: (poemId: number) => boolean
  toggleMemorized: (poemId: number) => void
  isMemorized: (poemId: number) => boolean

  // 诗单
  collections: PoetryCollection[]
  createCollection: (name: string) => string
  deleteCollection: (id: string) => void
  addToCollection: (collectionId: string, poemId: number) => void
  removeFromCollection: (collectionId: string, poemId: number) => void
  getCollectionPoems: (collectionId: string) => number[]
}

export const usePoetryStore = create<PoetryStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      memorized: [],
      collections: [],

      toggleFavorite: (poemId: number) => {
        set(state => {
          const exists = state.favorites.includes(poemId)
          return {
            favorites: exists
              ? state.favorites.filter(id => id !== poemId)
              : [...state.favorites, poemId],
          }
        })
      },

      isFavorite: (poemId: number) => {
        return get().favorites.includes(poemId)
      },

      toggleMemorized: (poemId: number) => {
        set(state => {
          const exists = state.memorized.includes(poemId)
          return {
            memorized: exists
              ? state.memorized.filter(id => id !== poemId)
              : [...state.memorized, poemId],
          }
        })
      },

      isMemorized: (poemId: number) => {
        return get().memorized.includes(poemId)
      },

      createCollection: (name: string) => {
        const id = `col_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        set(state => ({
          collections: [
            ...state.collections,
            { id, name, poemIds: [], createdAt: Date.now() },
          ],
        }))
        return id
      },

      deleteCollection: (id: string) => {
        set(state => ({
          collections: state.collections.filter(c => c.id !== id),
        }))
      },

      addToCollection: (collectionId: string, poemId: number) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId && !c.poemIds.includes(poemId)
              ? { ...c, poemIds: [...c.poemIds, poemId] }
              : c
          ),
        }))
      },

      removeFromCollection: (collectionId: string, poemId: number) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId
              ? { ...c, poemIds: c.poemIds.filter(id => id !== poemId) }
              : c
          ),
        }))
      },

      getCollectionPoems: (collectionId: string) => {
        const col = get().collections.find(c => c.id === collectionId)
        return col ? col.poemIds : []
      },
    }),
    {
      name: 'banju-poetry-store',
    }
  )
)
