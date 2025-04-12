const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// noti when user like post
const createLikeNotification = async (userId, recipeId) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { userId: true },
    });

    // Don't notify if user like their own recipe
    if (recipe.userId == userId) return null;

    return await prisma.notification.create({
      data: {
        userId: recipe.userId, // Recipe owner receives notification
        actorId: userId, // User who liked the recipe
        type: "like",
        recipeId,
      },
    });
  } catch (err) {
    console.log("Error creating like notification: ", err);
    throw err;
  }
};

// noti when user comment on a recipe
const createCommentNotification = async (userId, id, recipeId) => {
  try {
    // get recipe owner id
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: userId,
      },
      select: {
        userId: true,
      },
    });

    // Don't notify if user like their own recipe
    if (recipe.userId == userId) return null;

    return await prisma.notification.create({
      data: {
        userId: recipe.userId, // Recipe owner receives notification
        actorId: userId, // User who liked the recipe
        type: "comment",
        recipeId,
        commentId,
      },
    });
  } catch (err) {
    console.log("Error creating comment notification: ", err);
    throw err;
  }
};

const createFollowNotificaation = async (followerId, followingId) => {
  try {
    return await prisma.notification.create({
      data: {
        userId: followingId, // User being followed receives notification
        actorId: followerId, // User who followed
        type: "follow",
      },
    });
  } catch (err) {
    console.log("Error creating follow notificaation: ", err);
    throw err;
  }
};

// Get all noti for a user
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  try {
    const skip = page - 1 + limit;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const total = await prisma.notification.count({
      where: { userId },
    });

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    console.log("Error fetching user notifications:", err);
    throw err;
  }
};

// Mark noti as read
const markNotificationsAsRead = async (userId, notificationIds = null) => {
  try {
    if (notificationIds && notificationIds.length > 0) {
      return await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: {
          isRead: true,
        },
      });
    }

    // otherwise mark all noti for this user as read
    return await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  } catch (err) {
    console.log("Error marking notifications as read: ", err);
    throw err;
  }
};

// delete a noti
const deleteNotification = async (userId, notificationId) => {
  try {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  } catch (err) {
    console.log("Error deleting notification:", err);
    throw err;
  }
};

const getUnreadCount = async (userId) => {
  try {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  } catch (err) {
    console.lof("Error getting unread notification count:", err);
    throw err;
  }
};

module.exports = {
  createLikeNotification,
  createCommentNotification,
  createFollowNotificaation,
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
};
