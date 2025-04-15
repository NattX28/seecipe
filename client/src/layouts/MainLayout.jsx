import { Outlet } from "react-router";
import Navbar from "../components/shared/main/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1 justify-center items-start">
        <div className="w-full max-w-screen-xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default MainLayout;
