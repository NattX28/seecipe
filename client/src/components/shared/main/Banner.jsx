import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const Banner = () => {
  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={1}
        modules={[Autoplay]}
        className="w-full rounded-lg">
        <SwiperSlide>
          <div className="w-full h-[400px]">
            <img
              src="/images/grilledsalmonsteaks.jpg"
              alt="salmon"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-[400px]">
            <img
              src="/images/grilledsalmonsteaks.jpg"
              alt="salmon"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
