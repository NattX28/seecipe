import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { createRecipe } from "../api/recipe";
import { useNavigate } from "react-router";

const CreateRecipe = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "", notes: "" },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [instructionImages, setInstructionImages] = useState([
    { image: null, caption: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // user id
  const user = useAuthStore((state) => state.user);
  // handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagRemove) => {
    setTags(tags.filter((tag) => tag !== tagRemove));
  };

  // handle ingredients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "", notes: "" },
    ]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  // Handle instructions
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
    setInstructionImages([...instructionImages, { image: null, caption: "" }]);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);

      // Also remove corresponding image container
      const newInstructionImages = [...instructionImages];
      newInstructionImages.splice(index, 1);
      setInstructionImages(newInstructionImages);
    }
  };

  // Handle file uploads for instruction steps - one image per instruction
  const handleFileChange = (instructionIndex, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newInstructionImages = [...instructionImages];

      newInstructionImages[instructionIndex] = {
        ...newInstructionImages[instructionIndex],
        image: file,
      };

      setInstructionImages(newInstructionImages);
    }
  };

  const handleCaptionChange = (instructionIndex, value) => {
    const newInstructionImages = [...instructionImages];
    newInstructionImages[instructionIndex] = {
      ...newInstructionImages[instructionIndex],
      caption: value,
    };
    setInstructionImages(newInstructionImages);
  };

  const removeImage = (instructionIndex) => {
    const newInstructionImages = [...instructionImages];
    newInstructionImages[instructionIndex] = {
      ...newInstructionImages[instructionIndex],
      image: null,
      caption: "",
    };
    setInstructionImages(newInstructionImages);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Create form data for multipart/form-data (for image uploads)
      const formData = new FormData();

      const userId = user.id;
      formData.append("userId", userId);

      // basic recipe details
      formData.append("title", title);
      formData.append("description", description);
      formData.append("prepTime", prepTime);
      formData.append("cookTime", cookTime);
      formData.append("servings", servings);

      // ingredients and tags as JSON strings
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("tags", JSON.stringify(tags));
      // Process instructions as array of strings
      formData.append("instructions", JSON.stringify(instructions));

      // Add images to formData - only add images that exist
      let imageCount = 0;
      instructionImages.forEach((item, index) => {
        if (item.image) {
          formData.append(`images`, item.image);
          formData.append(`caption_${imageCount}`, item.caption || "");
          imageCount++;
        }
      });

      const response = await createRecipe(formData);
      console.log("success response: ", response);

      navigate(`/recipes/${response.id}`);
    } catch (err) {
      console.error("Error creating recipe:", err);
      setError("Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-main-color text-center">
          Create new recipe
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-second p-4">
              <h2 className="text-2xl font-bold text-white">
                Basic Information
              </h2>
            </div>
            <div className="p-6">
              <div className="form-control mb-4">
                <label className="text-sm font-medium text-main-color mb-2">
                  Recipe Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive name for your recipe"
                  className="input input-bordered w-full focus:border-third focus:ring focus:ring-second-transparent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="text-sm font-medium text-main-color mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Share the story behind this recipe or a brief description"
                  className="textarea textarea-bordered w-full h-32 focus:border-third focus:ring focus:ring-second-transparent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="text-sm font-medium text-main-color mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium text-main-color mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium text-main-color mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-second p-4">
              <h2 className="text-2xl font-bold text-white">Tags</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-forth rounded-full py-1 px-3 flex items-center">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-main-color hover:text-red-500 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag (e.g. dessert, vegetarian)"
                  className="input input-bordered flex-grow focus:border-third focus:ring focus:ring-second-transparent rounded-r-none"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                />
                <button
                  type="button"
                  className="btn  btn-accent "
                  onClick={handleAddTag}>
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-second p-4">
              <h2 className="text-2xl font-bold text-white">Ingredients</h2>
            </div>
            <div className="p-6">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4 pb-4 border-b last:border-b-0 border-gray-100">
                  <div className="form-control md:col-span-4">
                    <label className="text-sm font-medium text-main-color mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(index, "name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="text-sm font-medium text-main-color mb-2">
                      Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="Amount"
                      className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="text-sm font-medium text-main-color mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      placeholder="cups, tbsp, g"
                      className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleIngredientChange(index, "unit", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-control md:col-span-3">
                    <label className="text-sm font-medium text-main-color mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="finely chopped, cold"
                      className="input input-bordered focus:border-third focus:ring focus:ring-second-transparent"
                      value={ingredient.notes}
                      onChange={(e) =>
                        handleIngredientChange(index, "notes", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-control md:col-span-1 flex items-end">
                    <button
                      type="button"
                      className="btn btn-outline btn-error h-12 w-full"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length <= 1}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  className="btn btn-outline btn-accent rounded-full"
                  onClick={addIngredient}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Another Ingredient
                </button>
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-second p-4">
              <h2 className="text-2xl font-bold text-white">Instructions</h2>
            </div>
            <div className="p-6">
              {instructions.map((instruction, instructionIndex) => (
                <div
                  key={instructionIndex}
                  className="mb-8 pb-8 border-b last:border-b-0 border-gray-100">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-second flex items-center justify-center text-white font-bold text-lg">
                      {instructionIndex + 1}
                    </div>
                    <div className="flex-grow">
                      <textarea
                        placeholder={`Describe step ${
                          instructionIndex + 1
                        } in detail...`}
                        className="textarea textarea-bordered w-full h-24 focus:border-third focus:ring focus:ring-second-transparent"
                        value={instruction}
                        onChange={(e) =>
                          handleInstructionChange(
                            instructionIndex,
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-error"
                      onClick={() => removeInstruction(instructionIndex)}
                      disabled={instructions.length <= 1}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Image upload for this instruction */}
                  <div className="ml-14">
                    <div className="form-control mb-4">
                      <label className="text-sm font-medium text-main-color mb-2">
                        Add Photo for Step {instructionIndex + 1}
                      </label>
                      <input
                        type="file"
                        className="file-input file-input-bordered w-full focus:border-third focus:ring focus:ring-second-transparent"
                        onChange={(e) => handleFileChange(instructionIndex, e)}
                        accept="image/*"
                      />
                      <p className="text-xs text-forth-color mt-1">
                        Add a photo to illustrate this step
                      </p>
                    </div>

                    {instructionImages[instructionIndex]?.image && (
                      <div className="mt-4 p-4 bg-forth rounded-lg">
                        <h3 className="font-medium mb-3 text-main-color">
                          Photo for Step {instructionIndex + 1}
                        </h3>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden">
                              <img
                                src={URL.createObjectURL(
                                  instructionImages[instructionIndex].image
                                )}
                                alt={`Preview step ${instructionIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="grow">
                              <p className="text-sm truncate font-medium">
                                {instructionImages[instructionIndex].image.name}
                              </p>
                              <p className="text-xs text-forth-color">
                                {(
                                  instructionImages[instructionIndex].image
                                    .size / 1024
                                ).toFixed(1)}{" "}
                                KB
                              </p>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline btn-error"
                              onClick={() => removeImage(instructionIndex)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="form-control">
                            <input
                              type="text"
                              placeholder="Add a caption for this image"
                              className="input input-bordered input-sm w-full focus:border-third focus:ring focus:ring-second-transparent"
                              value={
                                instructionImages[instructionIndex].caption ||
                                ""
                              }
                              onChange={(e) =>
                                handleCaptionChange(
                                  instructionIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  className="btn btn-outline btn-accent rounded-full"
                  onClick={addInstruction}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Another Step
                </button>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="btn btn-lg rounded-full  text-white border-none shadow-lg px-12"
              style={{ backgroundColor: "#ffa725" }}
              disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating Recipe...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateRecipe;
