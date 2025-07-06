import React, { useEffect, useState } from 'react';
import './Slideshow.css'; // Import the CSS for slideshow

const Slideshow: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slideshow">
      {images.map((image, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img 
            src={image.replace('.webp', '.jpg')} 
            alt={`Slide ${index + 1}`} 
            onError={(e) => {
              // Fallback to WebP if JPG fails
              e.currentTarget.src = image;
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Slideshow;