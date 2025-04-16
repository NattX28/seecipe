import CardContainer from "../components/shared/main/CardContainer";
import TagContainer from "../components/shared/main/TagContainer";
import Banner from "./../components/shared/main/Banner";

const Home = () => {
  return (
    <div className="w-full flex-grow">
      <Banner />

      <h2 className="text-center text-3xl font-bold mt-16">
        What To <span className="text-third-color">Cook</span>?
      </h2>

      <TagContainer />

      <CardContainer />
    </div>
  );
};
export default Home;
