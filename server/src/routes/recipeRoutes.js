const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} = require("../controllers/recipeControllers");

router.post("/recipes", createRecipe);
router.get("/recipes", getAllRecipes);
router.get("/recipes/:id", getRecipeById);

module.exports = router;
