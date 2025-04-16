import { Outlet } from "react-router";
import Navbar from "../components/shared/main/Navbar";
import Footer from "../components/shared/main/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-full min-h-screen">
      <Navbar />
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
