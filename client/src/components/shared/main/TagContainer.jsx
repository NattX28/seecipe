import { useEffect, useState } from "react";
import { useRecipeStore } from "../../../store/recipeStore";
import { getAllTags } from "../../../api/recipe";

const TagContainer = () => {
  const { selectedTags, setSelectedTags, fetchRecipes } = useRecipeStore();
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tagName) => {
    const isSelected = selectedTags.includes(tagName);
    let newTags;

    if (isSelected) {
      newTags = selectedTags.filter((tag) => tag !== tagName);
    } else {
      newTags = [...selectedTags, tagName];
    }

    setSelectedTags(newTags);
  };

  return (
    <div className="flex justify-center gap-x-6 gap-y-2 flex-wrap mt-8">
      {availableTags.map((tag, index) => (
        <div
          key={index}
          className={`badge rounded-full py-4 ${
            selectedTags.includes(tag)
              ? "bg-[#3D3D3D] text-white"
              : "bg-white text-main-color"
          } cursor-pointer `}
          onClick={() => toggleTag(tag)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 text-third-color">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
          {tag}
        </div>
      ))}
    </div>
  );
};
export default TagContainer;
