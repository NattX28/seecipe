const formatRecipesForCards = (recipes) => {
  return recipes.map((recipe) => {
    const imageUrl =
      recipe.images && recipe.images.length > 0
        ? recipe.images[0].url
        : "/placeholder-recipe.jpg";

    // calculate raing
    const totalScore = recipe.ratings.reduce(
      (sum, rating) => sum + rating.score,
      0
    );
    const avgRating =
      recipe.ratings.length > 0 ? totalScore / recipe.ratings.length : 0;

    // adjust tags structure for easy to use
    const simplifiedTags = recipe.tags.map((item) => item.tag);

    // adjust response structure
    return {
      id: recipe.id,
      title: recipe.title,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      user: recipe.user,
      mainImage: recipe.images[0]?.url || null,
      tags: simplifiedTags,
      rating: {
        average: parseFloat(avgRating.toFixed(1)),
        count: recipe._count.ratings,
      },
      favoriteCount: recipe._count.favorites,
      image: imageUrl,
    };
  });
};

const formatRecipeDetail = (recipe) => {
  if (!recipe) return null;

  // calculate avg rating
  const totalScore = recipe.ratings.reduce(
    (sum, rating) => sum + rating.score,
    0
  );
  const avgRating =
    recipe.ratings.length > 0 ? totalScore / recipe.ratings.length : 0;

  // convert comment for easy to use
  const formattedComments = recipe.comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
  }));

  // convert review for easy to use
  const formattedRatings = recipe.ratings.map((rating) => ({
    id: rating.id,
    score: rating.score,
    review: rating.review,
    createdAt: rating.createdAt,
    user: rating.user,
  }));

  // convert tag for easy to use
  const simplifiedTags = recipe.tags.map((item) => item.tag);

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    instructions: recipe.instructions,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    user: recipe.user,
    ingredients: recipe.ingredients,
    images: recipe.images,
    tags: simplifiedTags,
    rating: {
      average: parseFloat(avgRating.toFixed(1)),
      count: recipe.ratings.length,
    },
    ratings: formattedRatings,
    comments: formattedComments,
    favoriteCount: recipe._count.Favorite,
  };
};

module.exports = { formatRecipesForCards, formatRecipeDetail };
