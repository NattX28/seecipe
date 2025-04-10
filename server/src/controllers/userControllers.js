const { PrismaClient } = require("@prisma/client");
const { formatRecipesForCards } = require("../services/recipeServices");
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        createdAt: true,
        recipes: {
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
              take: 3,
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
        },
        favorites: {
          include: {
            recipe: {
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
                  take: 3,
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
            },
          },
        },
        followedBy: true,
        following: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Format recipes and favorites for card view
    const formattedRecipes = formatRecipesForCards(user.recipes);
    const formattedFavorites = formatRecipesForCards(
      user.favorites.map((fav) => fav.recipe)
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      recipeCount: user.recipes.length,
      followersCount: user.followedBy.length,
      followingCount: user.following.length,
      recipes: formattedRecipes,
      favorites: formattedFavorites,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProfile };
