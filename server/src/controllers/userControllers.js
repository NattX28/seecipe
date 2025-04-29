const { PrismaClient } = require("@prisma/client");
const { formatRecipesForCards } = require("../services/recipeServices");
const notiService = require("../services/notificationServices");
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

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
              take: 2,
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
                  take: 2,
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

    const isOwnProfile = parseInt(userId) === parseInt(req.user.id);

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
      isOwnProfile: isOwnProfile,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followerUserId = req.user.id;
    const followingUserId = parseInt(id);

    // can't follow own
    if (followerUserId === followingUserId)
      return res.status(400).json({ message: "You can't following yourself" });

    const userExists = await prisma.user.findUnique({
      where: {
        id: followingUserId,
      },
    });

    if (!userExists) return res.status(404).json({ message: "User not found" });

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });

    // If already following, unfollow the user
    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerUserId,
            followingId: followingUserId,
          },
        },
      });

      return res.status(200).json({
        message: "Successfully unfollowed user",
        isFollowing: false,
      });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: followerUserId,
        followingId: followingUserId,
      },
    });

    await notiService.createFollowNotification(followerUserId, followingUserId);

    res.status(200).json({
      message: "Successfully followed user",
      data: follow,
      isFollowing: true,
    });
  } catch (err) {
    console.error("Error toggling follow status:", err);
    res
      .status(500)
      .json({ message: "Error updating follow status", error: err.message });
  }
};

const checkIfFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const followerUserId = req.user.id;
    const followingUserId = parseInt(id);

    // not check self, it just check only status

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });

    const isFollowing = !!existingFollow;

    return res.status(200).json({ isFollowing });
  } catch (err) {
    console.error("Error checking follow status:", err);
    res
      .status(500)
      .json({ message: "Error checking follow status", error: err.message });
  }
};

module.exports = { getProfile, followUser, checkIfFollow };
