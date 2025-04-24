import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api" || import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // check if the error is dur to an unauthorized request
    if (error.response && error.response.status === 401) {
      // clear auth state
      const clearUser = useAuthStore.getState().clearUser;
      clearUser();
    }
    return Promise.reject(error);
  }
);

export default api;
