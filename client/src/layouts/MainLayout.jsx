import { Outlet } from "react-router";
import Navbar from "../components/shared/main/Navbar";
import Footer from "../components/shared/main/Footer";
import NavbarUser from "../components/shared/auth/NavbarUser";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    console.log("Auth state in MainLayout:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {isAuthenticated ? <NavbarUser /> : <Navbar />}
      <main className="flex-grow w-full">
        <div className="w-full max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
