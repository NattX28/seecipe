import { useEffect } from "react";
import CardContainer from "../components/shared/main/CardContainer";
import LoginModal from "../components/shared/main/LoginModal";
import TagContainer from "../components/shared/main/TagContainer";
import { useRecipeStore } from "../store/recipeStore";
import Banner from "./../components/shared/main/Banner";

const Home = () => {
  const { fetchRecipes } = useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const images = [
    {
      url: "/images/grilledsalmonsteaks.jpg",
    },
  ];

  return (
    <div className="w-full flex-grow">
      <Banner images={images} />

      <h2 className="text-center text-3xl font-bold mt-16">
        What To <span className="text-third-color">Cook</span>?
      </h2>

      <TagContainer />

      <CardContainer />

      <LoginModal />
    </div>
  );
};
export default Home;
