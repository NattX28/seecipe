const express = require("express");
const { getProfile } = require("../controllers/userControllers");
const { authMiddleware } = require("../middlewares/middlewares");
const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
