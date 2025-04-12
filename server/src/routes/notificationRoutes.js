const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationControllers");
const { authMiddleware } = require("../middlewares/middlewares");

router.use(authMiddleware);

router.get("/notifications", getNotifications);
router.get("/notifications/unread-count", getUnreadCount);
router.put("/notifications/mark-read", markAsRead);
router.delete("/notifications/:id", deleteNotification);

module.exports = router;
