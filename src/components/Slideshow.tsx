import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Slideshow.css';

// Helper function to get the full image URL
const getImageUrl = (path: string): string => {
  // If the path is already a full URL (R2), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If R2 base URL is configured, use it
  const r2BaseUrl = import.meta.env.VITE_R2_PUBLIC_URL;
  if (r2BaseUrl) {
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // For carousel images, update the path to use the carousels folder
    const r2Path = cleanPath.replace('images/', 'carousels/');
    return `${r2BaseUrl}/${r2Path}`;
  }
  
  // Otherwise, use local path
  return path;
};

const Slideshow: React.FC<{ images: string[] }> = ({ images }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageHeight, setCurrentImageHeight] = useState<string>('auto');
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    // Only update height if this is the currently active slide
    if (swiper && swiper.activeIndex === index) {
      const img = event.currentTarget;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const containerWidth = img.parentElement?.clientWidth || 800;
      const calculatedHeight = containerWidth / aspectRatio;
      
      // Limit height to reasonable bounds
      const minHeight = 250;
      const maxHeight = 600;
      const height = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
      
      setCurrentImageHeight(`${height}px`);
    }
  };

  return (
    <div 
      className="relative group w-full max-w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(swiper) => {
          // Ensure autoplay continues after manual navigation
          if (swiper && swiper.autoplay) {
            swiper.autoplay.start();
          }
          
          // Update height for new slide
          const activeSlide = swiper.slides[swiper.activeIndex];
          const img = activeSlide?.querySelector('img');
          if (img && img.complete) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const containerWidth = activeSlide.clientWidth || 800;
            const calculatedHeight = containerWidth / aspectRatio;
            
            const minHeight = 250;
            const maxHeight = 600;
            const height = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
            
            setCurrentImageHeight(`${height}px`);
          }
        }}
        onTouchEnd={() => {
          // Restart autoplay after touch interaction
          if (swiper && swiper.autoplay) {
            swiper.autoplay.start();
          }
        }}
        spaceBetween={0}
        effect={'fade'}
        fadeEffect={{
          crossFade: true
        }}
        speed={1000}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          enabled: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full rounded-xl overflow-hidden shadow-2xl"
        style={{ 
          '--swiper-navigation-color': 'rgba(255, 255, 255, 0.9)',
          '--swiper-pagination-color': 'rgba(255, 107, 107, 0.9)',
          '--swiper-navigation-size': '35px',
          height: currentImageHeight,
          transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={getImageUrl(image)} 
                alt={`Slide ${index + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={(e) => handleImageLoad(e, index)}
              />
              {/* Subtle gradient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Click zones for navigation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left click zone */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full pointer-events-auto cursor-w-resize z-10"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous slide"
        />
        {/* Right click zone */}
        <button
          className="absolute right-0 top-0 w-1/3 h-full pointer-events-auto cursor-e-resize z-10"
          onClick={() => swiper?.slideNext()}
          aria-label="Next slide"
        />
      </div>
      
      {/* Custom navigation buttons that appear on hover */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          className="swiper-button-custom-prev absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center pointer-events-auto hover:bg-white/30 transition-all duration-200 hover:scale-110 z-20"
          onClick={() => swiper?.slidePrev()}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="swiper-button-custom-next absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center pointer-events-auto hover:bg-white/30 transition-all duration-200 hover:scale-110 z-20"
          onClick={() => swiper?.slideNext()}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slideshow;