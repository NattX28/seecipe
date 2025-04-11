const express = require("express");
const { getProfile, followUser } = require("../controllers/userControllers");
const { authMiddleware } = require("../middlewares/middlewares");
const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.post("/users/:id/follow", authMiddleware, followUser);

module.exports = router;
