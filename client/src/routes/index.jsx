import { createBrowserRouter, RouterProvider } from "react-router";

// pages
import Home from "../pages/Home";

// layouts
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register";
import RecipeDetail from "../pages/RecipeDetail";
import FavoritePage from "../pages/FavoritePage";
import ProtectedRoute from "./../components/shared/auth/ProtectedRoute";
import CreateRecipe from "../pages/CreateRecipe";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetail />,
      },
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/create-recipe",
    element: (
      <ProtectedRoute>
        <CreateRecipe />
      </ProtectedRoute>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
