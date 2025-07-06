import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { getImageUrl } from '../utils/imageUtils';

interface CarouselSlideshowProps {
  images: string[];
  slidesPerView?: number;
  showThumbnails?: boolean;
}

const CarouselSlideshow: React.FC<CarouselSlideshowProps> = ({ 
  images, 
  slidesPerView = 1,
  showThumbnails = false 
}) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      centeredSlides={false}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={true}
      loop={true}
      grabCursor={true}
      breakpoints={{
        640: {
          slidesPerView: slidesPerView > 1 ? 2 : 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: slidesPerView > 2 ? 3 : slidesPerView,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: slidesPerView,
          spaceBetween: 30,
        },
      }}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full rounded-lg"
      style={{ 
        '--swiper-navigation-color': '#4ECDC4',
        '--swiper-pagination-color': '#4ECDC4',
        '--swiper-navigation-size': '30px',
        paddingBottom: '50px',
      } as React.CSSProperties}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="pb-4">
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <img 
              src={getImageUrl(image)} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselSlideshow;