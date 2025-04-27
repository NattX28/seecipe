const express = require("express");
const { getProfile, followUser } = require("../controllers/userControllers");
const {
  requiredAuthMiddleware,
} = require("../middlewares/requiredAuthMiddleware");

const router = express.Router();

router.get("/profile", requiredAuthMiddleware, getProfile);
router.post("/users/:id/follow", requiredAuthMiddleware, followUser);

module.exports = router;
