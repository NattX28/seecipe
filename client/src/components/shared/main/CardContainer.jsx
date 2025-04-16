import { useState } from "react";
import CardRecipe from "./CardRecipe";
import ReactPaginate from "react-paginate";
const recipes = Array.from({ length: 25 });

const CardContainer = () => {
  const itemsPerPage = 6;
  const [currentpage, setCurrentPage] = useState(0);

  const offset = currentpage * itemsPerPage;
  const currentItems = recipes.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(recipes.length / itemsPerPage);

  const handlePageClick = (event) => {
    console.log("Page clicked:", event.selected);
    setCurrentPage(event.selected);
  };

  // Calculate current showing range
  const startItem = offset + 1;
  const endItem = Math.min(offset + itemsPerPage, recipes.length);

  return (
    <div className="pt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {currentItems.map((_, index) => (
          <CardRecipe key={index} size="md" />
        ))}
      </div>

      {/* Smaller pagination */}
      <div className="flex flex-col items-center mt-8">
        {/* Showing page indicator - made smaller */}
        <div className="text-center mb-2 text-xs text-base-content/70">
          Showing {startItem} to {endItem} of {recipes.length} recipes
        </div>

        {/* Smaller pagination controls */}
        <ReactPaginate
          breakLabel="..."
          nextLabel="»"
          previousLabel="«"
          onPageChange={handlePageClick}
          pageCount={pageCount}
          forcePage={currentpage}
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
          Page {currentpage + 1} of {pageCount}
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
