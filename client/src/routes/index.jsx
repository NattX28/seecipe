import { createBrowserRouter, RouterProvider } from "react-router";

// pages
import Home from "../pages/Home";

// layouts
import MainLayout from "../layouts/MainLayout";

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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
