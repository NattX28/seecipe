import api from "./axios";
const BASE_URL_RECIPES = "/recipes";
const BASE_URL_TAGS = "/tags";

export const createRecipe = async (formData) => {
  try {
    const response = await api.post(`${BASE_URL_RECIPES}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (err) {
    console.error("Error create recipes:", err);
    throw err;
  }
};

export const getAllRecipes = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      tags = [],
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page || 1);
    queryParams.append("limit", limit || 6);

    if (search) queryParams.append("search", search);

    if (tags && tags.length > 0) {
      tags.forEach((tag) => queryParams.append("tags", tag));
    }

    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    const response = await api.get(
      `${BASE_URL_RECIPES}?${queryParams.toString()}`
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching recipes:", err);
    throw err;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL_RECIPES}/${id}`);
    return response.data.data;
  } catch (err) {
    console.log("Error get recipe by id");
    throw err;
  }
};

export const toggleFav = async (recipeId) => {
  try {
    const response = await api.post(`${BASE_URL_RECIPES}/${recipeId}/favorite`);
    return response.data;
  } catch (err) {
    console.error("Error toggling favorite:", err);
    throw err;
  }
};

export const getUserFavorites = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 6,
    }).toString();

    const response = await api.get(`/favorites?${queryParams}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching user favorites:", err);
    throw err;
  }
};

export const getAllTags = async () => {
  try {
    const response = await api.get(`${BASE_URL_TAGS}`);
    return response.data.data;
  } catch (err) {
    console.log("Error get all tag");
    throw err;
  }
};

export const rateRecipe = async (id, score, review) => {
  try {
    const response = await api.post(`${BASE_URL_RECIPES}/${id}/rate`, {
      score,
      review,
    });
    return response.data.data;
  } catch (err) {
    console.log("Error rate recipe");
    throw err;
  }
};

export const getRecipeReviews = async (id) => {
  try {
    const response = await api.get(`${BASE_URL_RECIPES}/${id}/reviews`);
    return response.data.data;
  } catch (err) {
    console.log("Error get recipe reviews");
    throw err;
  }
};
