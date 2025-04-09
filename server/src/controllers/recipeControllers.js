const { PrismaClient } = require("@prisma/client");
const {
  formatRecipesForCards,
  formatRecipeDetail,
} = require("../services/recipeServices");
const prisma = new PrismaClient();

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

  try {
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
          create: images.map((image) => ({
            url: image.url,
            caption: image.caption || null,
            displayOrder: image.displayOrder || 0,
          })),
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
    const recipeWithRelations = await prisma.recipe.findUnique({
      where: { id: newRecipe.id },
      include: {
        ingredients: true,
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });

    res.status(201).json({
      message: "Recipe created successfully",
      data: recipeWithRelations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create recipe",
    });
  }
};

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

module.exports = { createRecipe, getAllRecipes, getRecipeById };
