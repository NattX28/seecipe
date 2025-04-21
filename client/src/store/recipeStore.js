import { create } from "zustand";
import { getAllRecipes } from "../api/recipe";

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
}));
