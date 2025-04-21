const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  rateRecipe,
  commentOnRecipe,
  saveToFavorites,
  getAllTags,
  getTagById,
} = require("../controllers/recipeControllers");
const { authMiddleware } = require("../middlewares/middlewares");

router.post("/recipes", createRecipe);
router.get("/recipes", getAllRecipes);
router.get("/recipes/:id", getRecipeById);
router.post("/recipes/:id/rate", authMiddleware, rateRecipe);
router.post("/recipes/:id/comments", authMiddleware, commentOnRecipe);
router.post("/recipes/:id/save", authMiddleware, saveToFavorites);
router.get("/tags", getAllTags);
router.get("/tags/:id", getTagById);

module.exports = router;
