import api from "./axios";

export const signup = async ({ username, email, password }) => {
  try {
    const res = await api.post("/signup", { username, email, password });
    console.log("Register respones", res);
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const login = async ({ username, password }) => {
  try {
    const res = await api.post("/login", { username, password });
    console.log("Login response:", res);
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/logout");
    console.log("Logout response:", res);
    return res.data;
  } catch (err) {
    console.log("Logout failed", err);
    throw err;
  }
};
