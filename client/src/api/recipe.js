import api from "./axios";

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

    const response = await api.get(`/recipes?${queryParams.toString()}`);

    return response.data;
  } catch (err) {
    console.error("Error fetching recipes:", err);
    throw err;
  }
};

export const getAllTags = async () => {
  try {
    const response = await api.get("/tags");
    return response.data.data;
  } catch (err) {
    console.log("Error get all tag");
    throw err;
  }
};
