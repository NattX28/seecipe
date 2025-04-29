const express = require("express");
const {
  getProfile,
  followUser,
  checkIfFollow,
} = require("../controllers/userControllers");
const {
  requiredAuthMiddleware,
} = require("../middlewares/requiredAuthMiddleware");

const router = express.Router();

router.get("/profile", requiredAuthMiddleware, getProfile);
router.get("/profile/:id", requiredAuthMiddleware, getProfile);
router.post("/users/:id/follow", requiredAuthMiddleware, followUser);
router.get("/follow/check/:id", requiredAuthMiddleware, checkIfFollow);

module.exports = router;
