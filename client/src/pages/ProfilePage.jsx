import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { checkIfFollow, followUser, getProfile } from "./../api/user";
import CardRecipe from "../components/shared/main/CardRecipe";
import { useRecipeStore } from "../store/recipeStore";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const endpoint = id ? `profile/${id}` : "/profile";
        const response = await getProfile(endpoint);
        let checkFollow;
        if (id) {
          checkFollow = await checkIfFollow(id);
          response.isFollowing = checkFollow.data.isFollowing;
        }
        setProfileData(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchProfileData();
    else
      navigate("/login", {
        state: { from: id ? `/profile/${id}` : "/profile" },
      });
  }, [id, isAuthenticated, navigate]);

  const handleFollow = async () => {
    if (!profileData) return;

    const response = await followUser(profileData.id);

    const checkFollow = await checkIfFollow(profileData.id);

    // Update follower count based on the response
    setProfileData((prev) => ({
      ...prev,
      followersCount: response.data.isFollowing
        ? prev.followersCount + 1
        : prev.followersCount - 1,
      isFollowing: checkFollow.data.isFollowing,
    }));

    try {
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  const handleFavoriteToggle = async (recipeId) => {
    await toggleFavorite(recipeId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="p-6 my-6">
        <div className="flex flex-col justify-center items-center gap-6">
          {/* Profile Pricture */}
          <div className="w-24 h-24 md:w-32 md:h-32 ">
            <img
              src={profileData.profilePicture || "/images/profile_avatar.png"}
              alt={`${profileData.username}'s profile`}
              className="rounded-full"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">{profileData.username}</h1>
            <p className="text-gray-500">
              Member since{" "}
              {new Date(profileData.createdAt).toLocaleDateString()}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="font-bold">{profileData.recipeCount}</p>
                <p className="text-sm text-gray-500">Recipes</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{profileData.followersCount}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{profileData.followingCount}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

            {/* Follow Button - only show if not own profile */}
            {!profileData.isOwnProfile && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    setIsFollowLoading(true);
                    await handleFollow();
                    setTimeout(() => setIsFollowLoading(false), 400); // delay เพื่อให้รู้สึก soft
                  }}
                  disabled={isFollowLoading}
                  className={`relative px-6 py-2 rounded-full font-semibold text-sm shadow-inner transition-all duration-300 ease-in-out
        ${
          isFollowLoading
            ? "bg-gray-200 text-gray-400 cursor-wait"
            : profileData.isFollowing
            ? "bg-second text-white hover:bg-orange-600"
            : "bg-second text-white hover:bg-orange-600"
        }`}>
                  {isFollowLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-md text-second" />
                      <span className="text-second">Loading...</span>
                    </span>
                  ) : profileData.isFollowing ? (
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3.172 4.828a4 4 0 015.656 0L10 6.343l1.172-1.515a4 4 0 015.656 5.656L10 14.828 3.172 10.99a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Following
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3.172 4.828a4 4 0 015.656 0L10 6.343l1.172-1.515a4 4 0 015.656 5.656L10 14.828 3.172 10.99a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Follow
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b mb-6 border-third">
        <button
          className={`px-4 py-2 ${
            activeTab === "recipes"
              ? "border-b-2 border-third text-third-color cursor-pointer"
              : "text-gray-600 cursor-pointer"
          }`}
          onClick={() => setActiveTab("recipes")}>
          Recipes
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "favorites"
              ? "border-b-2 border-third text-third-color cursor-pointer"
              : "text-gray-600 cursor-pointer"
          }`}
          onClick={() => setActiveTab("favorites")}>
          Favorites
        </button>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "recipes" && profileData.recipes.length > 0 ? (
          profileData.recipes.map((recipe, index) => (
            <CardRecipe
              key={recipe.id || index}
              id={recipe.id}
              size="md"
              title={recipe.title}
              user={recipe.user?.username}
              tags={recipe.tags?.map((tag) => tag)}
              rating={recipe.rating.average}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              image={recipe.mainImage || "/placeholder-recipe.jpg"}
              isFavorite={isFavorite(recipe.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        ) : activeTab === "favorites" && profileData.favorites.length > 0 ? (
          profileData.favorites.map((recipe, index) => (
            <CardRecipe
              key={recipe.id || index}
              id={recipe.id}
              size="md"
              title={recipe.title}
              user={recipe.user?.username}
              tags={recipe.tags?.map((tag) => tag)}
              rating={recipe.rating.average}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              image={recipe.mainImage || "/placeholder-recipe.jpg"}
              isFavorite={isFavorite(recipe.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {activeTab === "recipes"
              ? "No recipes found"
              : "No favorite recipes found"}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
