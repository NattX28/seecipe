const { PrismaClient } = require("@prisma/client");
const {
  formatRecipesForCards,
  formatRecipeDetail,
} = require("../services/recipeServices");
const { uploadImage } = require("../services/uploadServices");
const notiService = require("../services/notificationServices");
const prisma = new PrismaClient();

// create recipe
const createRecipe = async (req, res) => {
  const {
    userId,
    title,
    description,
    prepTime,
    cookTime,
    servings,
    instructions, // This will be an array of instructions
    ingredients,
    tags,
    images,
  } = req.body;

  const parsedIngredients =
    typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

  const parsedInstructions =
    typeof instructions === "string" ? JSON.parse(instructions) : instructions;

  const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

  try {
    const imageUploads = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = await uploadImage(file);

        imageUploads.push({
          url: imageUrl,
          caption: req.body[`caption_${i}` || null],
          displayOrder: i,
        });
      }
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        userId,
        title,
        description,
        prepTime,
        cookTime,
        servings,
        instructions, // Store the array directly in the database
        ingredients: {
          create: ingredients.map((ingredient) => ({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          })),
        },
        images: {
          create: imageUploads,
        },
      },
    });

    // handle tags isolate
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // find Tag or create tag first
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });

        // create relation in recipeTag
        await prisma.recipeTag.create({
          data: {
            recipeId: newRecipe.id,
            tagId: tag.id,
          },
        });
      }
    }

    // get recipe data with all relation for send back
    // const recipeWithRelations = await prisma.recipe.findUnique({
    //   where: { id: newRecipe.id },
    //   include: {
    //     ingredients: true,
    //     tags: {
    //       include: {
    //         tag: true,
    //       },
    //     },
    //     images: true,
    //   },
    // });

    res.status(201).json({
      message: "Recipe created successfully",
      data: newRecipe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create recipe",
    });
  }
};

//get recipe (pagination)
const getAllRecipes = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    tags = [],
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // convert parameter
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const tagArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

  try {
    // filter condition
    const whereCondition = {
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    };

    // add search by tag (if it has)
    if (tagArray.length > 0) {
      whereCondition.tags = {
        some: {
          tag: {
            name: {
              in: tagArray,
            },
          },
        },
      };
    }

    // get data recipes (recipe name, username, tags(only 3),main image, rating, prepTime,cookTime,servings )
    const recipes = await prisma.recipe.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        prepTime: true,
        cookTime: true,
        servings: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: 3, // limit disply only 3 tags
        },
        images: {
          select: {
            id: true,
            url: true,
          },
          where: {
            displayOrder: 0,
          },
          take: 1,
        },

        // calculate rating
        ratings: {
          select: {
            score: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            favorites: true,
          },
        },
      },
      skip: skip,
      take: limitNum,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const formatedRecipes = formatRecipesForCards(recipes);

    // Calculate the total number of recipes that match the condition.
    const totalRecipes = await prisma.recipe.count({
      where: whereCondition,
    });

    res.status(200).json({
      message: "Recipes retrieved successfully",
      data: formatedRecipes,
      pagination: {
        total: totalRecipes,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecipes / limitNum),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to retrieve recipes",
    });
  }
};

// get recipe by id
const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        ingredients: {
          orderBy: {
            id: "asc",
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // convert data to appropriate form
    const formattedRecipe = formatRecipeDetail(recipe);
    res.status(200).json({
      message: "Recipe retrieved successfully",
      data: formattedRecipe,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to retrieve recipe",
    });
  }
};

// rate a recipe
const rateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { review, score } = req.body;
    const recipeId = parseInt(id);

    // validate input (limit 5)
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    // Create or update the rating
    const rating = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId: userId,
          recipeId: recipeId,
        },
      },
      update: {
        score,
        review,
      },
      create: {
        userId,
        recipeId: recipeId,
        score,
        review,
      },
    });

    // Send notification to recipe owner
    await notiService.createLikeNotification(userId, recipeId);

    res
      .status(200)
      .json({ message: "Rating recipe successfully", data: rating });
  } catch (err) {
    console.error("Error rating recipe: ", err);
    res
      .status(500)
      .json({ message: "Error rating recipe", error: err.message });
  }
};

const commentOnRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    const recipeId = parseInt(id);

    if (!content)
      return res.status(400).json({ message: "Comment content is required" });

    const comment = await prisma.comment.create({
      data: {
        userId,
        recipeId: recipeId,
        content,
      },
    });

    // Send notification to recipe owner
    await notiService.createCommentNotification(userId, recipeId, comment.id);

    res
      .status(200)
      .json({ message: "Comment on recipe successfully", data: comment });
  } catch (err) {
    console.error("Error commenting on recipe: ", err);
    res
      .status(500)
      .json({ message: "Error commenting on recipe", error: err.message });
  }
};

// Save recipe to favorites
const saveToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const recipeId = parseInt(id);

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    // if already a favorite, remove it.
    if (existingFavorite) {
      await prisma.favorite.delete({
        userId_recipeId: {
          userId,
          recipeId,
        },
      });

      return res.status(200).json({
        message: "Recipe remove from favorites successfully",
        data: null,
        isFavorite: false,
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        recipeId,
        userId,
      },
    });

    res.status(200).json({
      message: "Add recipe to favorites successfully",
      data: favorite,
      isFavorite: true,
    });
  } catch (err) {
    console.error("Error toggling favorite status: ", err);
    res
      .status(500)
      .json({ message: "Error updating favorites", error: err.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({
      message: "Get all tag successfully",
      data: tags,
    });
  } catch (err) {
    console.log("Error get all tag: ", err);
    res.status(500).json({ message: "Error get all tag", error: err.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        recipes: {
          include: {
            recipe: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (err) {
    console.log("Error get tag by id: ", err);
    res
      .status(500)
      .json({ message: "Error get tag by id", error: err.message });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  rateRecipe,
  commentOnRecipe,
  saveToFavorites,
  getAllTags,
  getTagById,
};
