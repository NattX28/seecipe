import { createBrowserRouter, RouterProvider } from "react-router";

// pages
import Home from "../pages/Home";

// layouts
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Register />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
