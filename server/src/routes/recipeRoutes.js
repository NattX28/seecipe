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
  getFavorites,
} = require("../controllers/recipeControllers");

const multer = require("multer");
const {
  requiredAuthMiddleware,
} = require("../middlewares/requiredAuthMiddleware");
const { optionalAuthMiddleware } = require("../middlewares/optionalMiddleware");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.post(
  "/recipes",
  requiredAuthMiddleware,
  upload.array("images", 5),
  createRecipe
);
router.get("/recipes", optionalAuthMiddleware, getAllRecipes);
router.get("/recipes/:id", optionalAuthMiddleware, getRecipeById);
router.post("/recipes/:id/rate", requiredAuthMiddleware, rateRecipe);
router.post("/recipes/:id/comments", requiredAuthMiddleware, commentOnRecipe);
router.post("/recipes/:id/favorite", requiredAuthMiddleware, saveToFavorites);
router.get("/favorites", requiredAuthMiddleware, getFavorites);
router.get("/tags", getAllTags);
router.get("/tags/:id", getTagById);

module.exports = router;
