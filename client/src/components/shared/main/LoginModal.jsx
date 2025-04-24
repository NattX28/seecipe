import { useState } from "react";
import { login } from "../../../api/auth";
import ButtonMod from "./ButtonMod";
import { useAuthStore } from "../../../store/authStore";

const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login({ username, password });
      console.log("Logged in:", data);

      setUser({
        username,
        id: data.userId || "",
      });

      document.getElementById("login_modal").close();
    } catch (err) {
      console.log("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box relative">
        {/* Close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* Title */}
        <h2 className="text-2xl font-bold text-main-color text-center mb-8">
          Login
        </h2>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            <ButtonMod text="Login" color="#ffa725" classOther="px-16 mt-4" />
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default LoginModal;
