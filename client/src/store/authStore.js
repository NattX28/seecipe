import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout } from "../api/auth";

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
          set({ user: null, isAuthenticated: false });
        } catch (err) {
          console.log("Logout error", err);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),

    {
      name: "auth-storage",
    }
  )
);
