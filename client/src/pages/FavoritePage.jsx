import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import CardRecipe from "../components/shared/main/CardRecipe";
import { useRecipeStore } from "../store/recipeStore";

const FavoritePage = () => {
  const {
    userFavorites,
    pagination,
    loading,
    error,
    setPage,
    fetchUserFavorites,
    toggleFavorite,
    isFavorite,
  } = useRecipeStore();

  useEffect(() => {
    fetchUserFavorites();
  }, [pagination.page]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  const handleFavoriteToggle = async (recipeId) => {
    await toggleFavorite(recipeId);
  };

  if (loading)
    return <div className="pt-16 text-center">Loading favorite recipes...</div>;
  if (error) return <div className="pt-16 text-center text-error">{error}</div>;

  // Check if there are no favorites
  if (userFavorites.length === 0) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center">
        <div className="text-center text-xl mb-4">
          You have no favorite recipes yet
        </div>
        <div className="text-center text-base-content/70">
          Browse recipes and click the heart icon to add them to your favorites
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <h1 className="text-3xl font-bold mb-8">My Favorite Recipes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {userFavorites.map((recipe, index) => (
          <CardRecipe
            key={recipe.id || index}
            id={recipe.id}
            size="md"
            title={recipe.title}
            user={recipe.user?.username}
            tags={recipe.tags?.map((tag) => tag)}
            rating={recipe.avgRating}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
            image={recipe.mainImage || "/placeholder-recipe.jpg"}
            isFavorite={true} // All recipes here are favorites
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center mt-8">
        {/* Showing page indicator */}
        <div className="text-center mb-2 text-xs text-base-content/70">
          Showing{" "}
          {pagination.page > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} favorite recipes
        </div>

        {/* Pagination controls */}
        <ReactPaginate
          breakLabel="..."
          nextLabel="»"
          previousLabel="«"
          onPageChange={handlePageClick}
          pageCount={pagination.totalPages}
          forcePage={pagination.page - 1}
          containerClassName="join"
          pageClassName="join-item btn btn-sm"
          pageLinkClassName="flex items-center justify-center w-full h-full"
          previousClassName="join-item btn btn-sm"
          previousLinkClassName="flex items-center justify-center w-full h-full"
          nextClassName="join-item btn btn-sm"
          nextLinkClassName="flex items-center justify-center w-full h-full"
          breakClassName="join-item btn btn-sm"
          breakLinkClassName="flex items-center justify-center w-full h-full"
          activeClassName="btn-primary"
          disabledClassName="btn-disabled"
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
        />

        {/* Current page indicator */}
        <div className="text-center mt-2 text-xs text-base-content/70">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
