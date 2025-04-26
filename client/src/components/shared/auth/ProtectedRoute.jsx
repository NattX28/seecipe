import { Navigate } from "react-router";
import { useAuthStore } from "../../../store/authStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // If user is not authenticated, open the login modal
    if (!user) {
      setTimeout(() => {
        document.getElementById("login_modal").showModal();
      }, 100);
    }
  }, [user]);

  if (!user) return <Navigate to="/" />;

  return children;
};
export default ProtectedRoute;
