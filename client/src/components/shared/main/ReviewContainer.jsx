import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Review from "./Review";

const ReviewContainer = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return <div className="text-center py-8">No reviews available yet.</div>;
  }
  return (
    <div className="w-full flex justify-center items-center py-8">
      <div className="w-full">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={ratings.length > 1}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: ratings.length === 1 ? 1 : "auto",
              centeredSlides: true,
            },
          }}
          modules={[Autoplay]}
          className="mySwiper">
          {ratings.map((rating, index) => (
            <SwiperSlide key={index} className="flex justify-center py-4">
              <div className="w-full flex justify-center">
                <Review rating={rating} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
export default ReviewContainer;
