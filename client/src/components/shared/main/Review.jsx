import { useState } from "react";

const Review = ({ rating }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format date to be more readable
  const formattedDate = new Date(rating.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Generate stars based on rating score
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class={`size-4 ${
            i < rating.score
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}>
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clip-rule="evenodd"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div
      className={`flex gap-6 bg-white rounded-2xl shadow-lg px-8 py-6 transition-all duration-300 w-full max-w-2xl ${
        isHovered
          ? "shadow-xl translate-y-0"
          : "hover:shadow-xl hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex flex-col items-center">
        <div className="relative min-h-36">
          <figure
            className={`rounded-full w-20 h-20 overflow-hidden shadow-md transition-all duration-300 ${
              isHovered ? "shadow-lg" : ""
            }`}>
            <img
              src={rating.user.profilePicture || "/images/profile_avatar.png"}
              alt={rating.user.username}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHovered ? "scale-105" : ""
              }`}
            />
          </figure>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 shadow-md">
            <div className="flex">{renderStars()}</div>
          </div>
          <p className="text-center font-medium mt-2 text-gray-800">
            {rating.user.username}
          </p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="relative">
          <span className="absolute text-6xl font-serif text-third-color opacity-40">
            "
          </span>
          <p className="text-gray-700 pt-2 px-8 pl-10 italic relative z-10">
            {rating.review}
          </p>
          <span className="absolute text-6xl font-serif text-third-color opacity-40 -bottom-1 right-0 leading-none">
            "
          </span>
        </div>
      </div>
    </div>
  );
};
export default Review;
