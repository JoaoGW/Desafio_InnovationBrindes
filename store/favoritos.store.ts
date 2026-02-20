import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipagem dos dados que serão armazenados e/ou utilizados no workflow do sis de favoritos
type FavoritesState = {
  favorites: string[];
  showOnlyFavorites: boolean;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setShowOnlyFavorites: (value: boolean) => void;
};

/**
 * (OBS: A documentação abaixo foi gerada automaticamente pelo Copilot)
 * Store Zustand para gerenciar itens favoritos.
 * Persiste os IDs dos favoritos e preferências de exibição no armazenamento local.
 *
 * @typedef {Object} FavoritesState
 * @property {number[]} favorites - Array de IDs dos itens favoritos
 * @property {boolean} showOnlyFavorites - Flag para exibir apenas itens favoritados
 * @property {(id: number) => void} toggleFavorite - Adiciona ou remove um item dos favoritos
 * @property {(id: number) => boolean} isFavorite - Verifica se um item está favoritado
 * @property {(value: boolean) => void} setShowOnlyFavorites - Alterna o modo de exibição apenas de favoritos
 *
 * @returns {FavoritesState} O store de favoritos com persistência
 *
 * @example
 * const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
 * toggleFavorite(123);
 * const liked = isFavorite(123);
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      showOnlyFavorites: false,

      toggleFavorite: (id) => {
        const { favorites } = get();

        if (favorites.includes(id)) {
          set({
            favorites: favorites.filter((fav) => fav !== id),
          });
        } else {
          set({
            favorites: [...favorites, id],
          });
        }
      },

      isFavorite: (id) => {
        return get().favorites.includes(id);
      },

      setShowOnlyFavorites: (value) =>
        set({ showOnlyFavorites: value }),
    }),
    {
      name: "favorites-storage",
    }
  )
);