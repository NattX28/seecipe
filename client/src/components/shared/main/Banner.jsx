import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const Banner = ({ images }) => {
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
        {images.map((im, index) => (
          <SwiperSlide key={index}>
            <div className={`w-full h-[320px]`}>
              <img
                src={im.url}
                alt="salmon"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
