const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationControllers");
const {
  requiredAuthMiddleware,
} = require("../middlewares/requiredAuthMiddleware");

// router.use(requiredAuthMiddleware);

router.get("/notifications", requiredAuthMiddleware, getNotifications);
router.get(
  "/notifications/unread-count",
  requiredAuthMiddleware,
  getUnreadCount
);
router.put("/notifications/mark-read", requiredAuthMiddleware, markAsRead);
router.delete("/notifications/:id", requiredAuthMiddleware, deleteNotification);

module.exports = router;
