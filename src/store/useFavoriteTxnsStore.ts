import {create} from 'zustand'
import { persist } from 'zustand/middleware'

interface Item {
  txId: string;
}

interface FavoriteStore {
  favorites: Item[]
  addFavorite: (item: Item) => void
  removeFavorite: (itemId: number | string) => void
  isFavorite: (itemId: number | string) => boolean
}
// @ts-ignore
export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        set((state) => ({
          favorites: [...state.favorites, item],
        }))
      },

      removeFavorite: (itemId) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.txId !== itemId),
        }))
      },

      isFavorite: (itemId) => {
        return get().favorites.some((item) => item.txId === itemId)
      },
    }),
    {
      name: 'favorites-txns-storage', // unique name for localStorage
    }
  )
)