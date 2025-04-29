import api from "./axios";

export const getProfile = async (endpoint) => {
  try {
    const response = await api.get(`${endpoint}`);
    return response.data;
  } catch (err) {
    console.error("Error get profile: ", err);
    throw err;
  }
};

export const followUser = async (id) => {
  try {
    const response = await api.post(`/users/${id}/follow`, {});
    return response;
  } catch (error) {
    console.error("Error follow: ", err);
    throw err;
  }
};

export const checkIfFollow = async (id) => {
  try {
    const response = await api.get(`/follow/check/${id}`);
    return response;
  } catch (error) {
    console.error("Error check if follow: ", err);
    throw err;
  }
};
