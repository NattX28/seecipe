import { create } from "zustand";
import { getAllRecipes, getUserFavorites, toggleFav } from "../api/recipe";

export const useRecipeStore = create((set, get) => ({
  recipes: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  },
  loading: false,
  error: null,
  search: "",
  selectedTags: [],
  sortBy: "createdAt",
  sortOrder: "desc",

  userFavorites: [],
  favoritesSet: new Set(),

  // setter with auto fetch
  setSearch: (search) => {
    set({ search, pagination: { ...get().pagination, page: 1 } });
    get().fetchRecipes();
  },

  setSelectedTags: (tags) => {
    set({ selectedTags: tags, pagination: { ...get().pagination, page: 1 } });
    get().fetchRecipes();
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
  },

  setSorting: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder, pagination: { ...get().pagination, page: 1 } });
    get().fetchRecipes();
  },

  // Fetch recipes
  fetchRecipes: async () => {
    const { pagination, search, selectedTags, sortBy, sortOrder } = get();
    set({ loading: true, error: null });

    try {
      const response = await getAllRecipes({
        page: pagination.page,
        limit: pagination.limit,
        search,
        tags: selectedTags,
        sortBy,
        sortOrder,
      });

      set({
        recipes: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (err) {
      console.error("Store error:", err);
      set({
        error: err.message || "Failed to fetch recipes",
        loading: false,
      });
    }
  },

  // Clear filters
  clearFilters: () => {
    set({
      search: "",
      selectedTags: [],
      pagination: { ...get().pagination, page: 1 },
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    get().fetchRecipes();
  },

  fetchUserFavorites: async () => {
    const { pagination } = get();
    set({ loading: true, error: null });

    try {
      const response = await getUserFavorites({
        page: pagination.page,
        limit: pagination.limit,
      });

      set({
        userFavorites: response.data,
        pagination: response.pagination,
        loading: false,
        favoritesSet: new Set(response.data.map((recipe) => recipe.id)),
      });
    } catch (err) {
      console.error("Error fetching favorites:", err);
      set({
        error: err.message || "Failed to fetch favorite recipes",
        loading: false,
      });
    }
  },

  toggleFavorite: async (recipeId) => {
    try {
      const response = await toggleFav(recipeId);
      const { isFavorite } = response;

      // update local state
      set((state) => {
        const newFavoritesSet = new Set(state.favoritesSet);

        if (isFavorite) {
          newFavoritesSet.add(recipeId);
        } else {
          newFavoritesSet.delete(recipeId);
          // If we're on the favorites page, also remove from the array
          if (window.location.pathname.includes("favorites")) {
            const updatedFavorites = state.userFavorites.filter(
              (recipe) => recipe.id !== recipeId
            );
            return {
              userFavorites: updatedFavorites,
              favoritesSet: newFavoritesSet,
            };
          }
        }

        return { favoritesSet: newFavoritesSet };
      });

      // If we're on the favorites page and removed a favorite, refresh the list
      if (!isFavorite && window.location.pathname.includes("favorites")) {
        get().fetchUserFavorites();
      }

      return isFavorite;
    } catch (err) {
      console.error("Error toggling favorite:", err);
      return null;
    }
  },

  clearFavorites: () => {
    set({
      userFavorites: [],
      favoritesSet: new Set(),
    });
  },

  // Helper to check if recipe is favorited
  isFavorite: (recipeId) => get().favoritesSet.has(recipeId),
}));
