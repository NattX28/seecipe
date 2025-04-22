import { useEffect, useState } from "react";
import CardRecipe from "./CardRecipe";
import ReactPaginate from "react-paginate";
import { useRecipeStore } from "../../../store/recipeStore";

const CardContainer = () => {
  const { recipes, pagination, loading, error, setPage, fetchRecipes } =
    useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, [pagination.page]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  if (loading)
    return <div className="pt-16 text-center">Loading recipes...</div>;
  if (error) return <div className="pt-16 text-center text-error">{error}</div>;

  return (
    <div className="pt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {recipes.map((recipe, index) => (
          <CardRecipe
            key={recipe.id || index}
            id={recipe.id}
            size="md"
            title={recipe.title}
            user={recipe.user?.username}
            tags={recipe.tags?.map((tag) => tag)}
            rating={recipe.averageRating}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
            image={recipe.mainImage || "/placeholder-recipe.jpg"}
          />
        ))}
      </div>

      {/* Smaller pagination */}
      <div className="flex flex-col items-center mt-8">
        {/* Showing page indicator - made smaller */}
        <div className="text-center mb-2 text-xs text-base-content/70">
          Showing{" "}
          {pagination.page > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} recipes
        </div>

        {/* Smaller pagination controls */}
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

        {/* Current page indicator - made smaller */}
        <div className="text-center mt-2 text-xs text-base-content/70">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
