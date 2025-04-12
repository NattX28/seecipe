const notiService = require("../services/notificationServices");

// Get notifications for the authenticated user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(res.query.page) || 1;
    const limit = parseInt(res.query.limit) || 20;

    const result = await notiService.getUserNotifications(userId, page, limit);
    return res.status(200).json({
      data: result,
    });
  } catch (err) {
    console.log("Error in getNotifications controller: ", err);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationIds } = req.body;

    await notiService.markNotificationsAsRead(userId, notificationIds);
  } catch (err) {
    console.log("Error in markAsRead controller:", err);
    return res
      .status(500)
      .json({ message: "Failed to mark notifications as read" });
  }
};

// delete a notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);

    await notiService.deleteNotification(userId, notificationId);

    return res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.log("Error in deleteNotification controller:", err);
    return res.status(500).json({ message: "Failed to delete notification" });
  }
};

// get unread noti count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await notiService.getUnreadCount(userId);

    return res.status(200).json({ data: count });
  } catch (err) {
    console.log("Error in getUnreadCount controller:", err);
    return res.status(500).json({ message: "Failed to get unread count" });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
};
