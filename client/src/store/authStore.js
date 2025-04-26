import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout } from "../api/auth";
import { useRecipeStore } from "./recipeStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (userData) => set({ user: userData, isAuthenticated: true }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      logoutUser: async () => {
        try {
          await logout();
          await useAuthStore.persist.clearStorage();
          set({ user: null, isAuthenticated: false });

          const clearFavorites = useRecipeStore.getState().clearFavorites;
          if (clearFavorites) {
            clearFavorites();
          }
        } catch (err) {
          console.log("Logout error", err);
          await useAuthStore.persist.clearStorage();
          set({ user: null, isAuthenticated: false });

          const clearFavorites = useRecipeStore.getState().clearFavorites;
          if (clearFavorites) {
            clearFavorites();
          }
        }
      },
    }),

    {
      name: "auth-storage",
    }
  )
);
