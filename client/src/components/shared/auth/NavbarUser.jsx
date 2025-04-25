import { useState } from "react";
import { useRecipeStore } from "../../../store/recipeStore";
import { useAuthStore } from "../../../store/authStore";

const NavbarUser = () => {
  const { setSearch, fetchRecipes } = useRecipeStore();
  const { user, logoutUser } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchRecipes();
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <nav className="w-full bg-main py-2">
      <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          SEE<span className="text-third-color">CIPE</span>
        </h1>
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
          <button className="cursor-pointer transition-transform duration-100 hover:scale-[1.02]">
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
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
          {/* notification */}
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="relative  cursor-pointer transition-transform duration-100 hover:scale-[1.02]">
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {/* if have unread noti */}
              <div className="absolute bottom-1 right-0 status status-warning animate-bounce"></div>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
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
                    src={user.profilePicture || "/images/chef.jpg"}
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
