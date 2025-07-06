import React, { useEffect, useState } from 'react';
import './Slideshow.css'; // Import the CSS for slideshow

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
          <img src={getImageUrl(image)} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Slideshow;