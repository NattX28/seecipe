import { useEffect, useState } from "react";
import { useRecipeStore } from "../../../store/recipeStore";
import { useAuthStore } from "../../../store/authStore";
import NotificationDropdown from "./NotificationDropdown";
import { useNavigate } from "react-router";

const NavbarUser = () => {
  const { setSearch, fetchRecipes, fetchUserFavorites } = useRecipeStore();
  const { user, logoutUser } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Initialize favorites when the navbar loads (user is authenticated)
  useEffect(() => {
    fetchUserFavorites();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchRecipes();
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="w-full bg-main py-2">
      <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-bold">
            SEE<span className="text-third-color">CIPE</span>
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <form onSubmit={handleSearch}>
            <label className="input rounded-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search recipe..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>
          </form>

          {/* favorite */}
          <div
            className="cursor-pointer transition-transform duration-100 hover:scale-[1.02]"
            onClick={() => navigate("/favorites")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-6 text-third-color">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
              />
            </svg>
          </div>

          {/* notification */}
          <NotificationDropdown />

          {/* Add new recipe */}
          <div
            className="cursor-pointer transition-transform duration-100 hover:scale-[1.02]"
            onClick={() => navigate("/create-recipe")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="size-6 text-third-color">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm flex flex-col items-end">
            Hello, <p className="text-lg -mt-2">{user?.username}</p>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-12 h-12 rounded-full cursor-pointer hover:opacity-95">
              {/* user */}
              <div>
                <figure className="rounded-full w-12 h-12 shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <img
                    src={user.profilePicture || "/images/profile_avatar.png"}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                </figure>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <a onClick={() => navigate("/profile")}>Profile</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavbarUser;
