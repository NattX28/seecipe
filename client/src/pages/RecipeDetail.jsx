import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getRecipeById, getRecipeReviews } from "../api/recipe";
import Tag from "../components/shared/main/Tag";
import ReviewContainer from "../components/shared/main/ReviewContainer";
import ReviewModal from "../components/shared/auth/ReviewModal";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
        setReviews(data.ratings || []);
      } catch (err) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const reviewsData = await getRecipeReviews(id);
      console.log("reviewsData", reviewsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Failed to refresh reviews:", err);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        Loading recipe details...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto py-8 text-center text-error">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col mt-8">
      <ReviewModal onReviewSubmitted={handleReviewSubmitted} />
      <div className="flex items-center gap-16 mb-4">
        <h1 className="text-4xl font-bold">{recipe.title}</h1>
        <div className="flex gap-2">
          {recipe.tags.map((tag) => (
            <Tag
              key={tag.name}
              tagName={tag.name}
              color="bg-white "
              textColor="text-main-color"
              border={"#ffa725"}
              size="lg"
            />
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="w-full h-[420px]">
        <figure className="w-full h-full">
          <img
            src={recipe.images[0]?.url}
            alt="Banner image"
            className="w-full h-full object-contain"
          />
        </figure>
      </div>

      {/* Detail */}
      <div className="flex justify-between mt-8 my-4">
        <div className="flex items-center gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 bg-second-transparent rounded-lg m-2">
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="text-medium text-base-content/70">Prep Time</div>
            <div className="font-semibold">{recipe.prepTime} mins</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 bg-second-transparent rounded-lg m-2">
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="text-medium text-base-content/70">Cook Time</div>
            <div className="font-semibold">{recipe.cookTime} mins</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 bg-second-transparent rounded-lg m-2">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
          </svg>
          <div>
            <div className="text-medium text-base-content/70">Servings</div>
            <div className="font-semibold">{recipe.servings} people</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 bg-second-transparent rounded-lg m-2">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">
            {recipe.rating?.average || 0} ({recipe.rating?.count || 0})
          </span>
        </div>
      </div>

      {/* Description & user who created it */}
      <div className="flex w-full justify-between items-start gap-16 mt-16">
        <p className="text-lg">{recipe.description}</p>

        <div className="card bg-white rounded-2xl w-56 h-56 mb-8 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="card-body items-center">
            <figure className="rounded-full w-32 h-32 shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <img
                src={recipe.user.profilePicture || "/images/chef.jpg"}
                alt={recipe.user.username}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="mt-1">
              <p className="text-sm text-center text-base-content/70">
                recipe by
              </p>
              <p className="text-lg text-center font-medium">
                {recipe.user.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {recipe.ingredients?.map((ingredient, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mt-0.5 flex-shrink-0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            <span>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
              {ingredient.notes && (
                <span className="text-base-content/70">
                  {" "}
                  ({ingredient.notes})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Instructions */}
      <h2 className="text-2xl font-semibold mt-16 mb-4">
        Cooking <span className="text-third-color">Instructions</span>
      </h2>
      <div className="flex flex-col gap-4">
        {recipe.instructions.map((instruc, index) => (
          <div
            className="flex items-start gap-16 bg-white px-12 py-10 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
            key={index}>
            <h4 className="text-2xl text-third-color font-semibold">
              {index + 1}
            </h4>
            <div className="flex-1">
              <p className="text-main-color text-lg">{instruc}</p>

              {recipe.images[index]?.url && (
                <figure className="max-w-full mt-6">
                  <img
                    src={recipe.images[index].url}
                    alt={`step ${index + 1}`}
                    className="rounded-lg mx-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  />
                  {recipe.images[index]?.caption && (
                    <figcaption className="text-center mt-2 text-base-content/70">
                      {recipe.images[index].caption}
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review */}
      <div className="flex items-center gap-4 mt-16 mb-4">
        <h2 className="text-2xl font-semibold">
          Cooking <span className="text-third-color">Reviews</span>
        </h2>
        <button
          onClick={() => document.getElementById("review_modal").showModal()}
          className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
      </div>

      {/* {recipe.ratings?.map((rating) => (
        <Review rating={rating} />
      ))} */}
      {recipe.ratings && <ReviewContainer ratings={reviews} />}
    </div>
  );
};
export default RecipeDetail;
