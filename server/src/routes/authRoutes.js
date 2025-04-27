const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authControllers");
const {
  requiredAuthMiddleware,
} = require("../middlewares/requiredAuthMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", requiredAuthMiddleware, logout);

module.exports = router;
