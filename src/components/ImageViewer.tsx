import React, { useState, useEffect } from 'react';

interface GalleryImage {
  id: string;
  title: string;
  original: string;
  sizes: {
    thumb?: string;
    medium?: string;
    full?: string;
  };
}

interface ImageViewerProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
  getImageUrl: (path: string) => string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex, onClose, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const currentImage = images[currentIndex];
  const imagePath = currentImage.sizes.full || currentImage.sizes.medium || currentImage.sizes.thumb || '';
  const imageSrc = getImageUrl(imagePath);

  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  const navigatePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setLoading(true);
    setImageError(false);
  };

  const navigateNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setLoading(true);
    setImageError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl font-light z-10"
        aria-label="Close"
      >
        ×
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white/80 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        {/* Previous button */}
        <button
          onClick={navigatePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl font-light"
          aria-label="Previous image"
        >
          ‹
        </button>

        {/* Image */}
        <div className="relative max-w-full max-h-full">
          {loading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          {!imageError ? (
            <img
              src={imageSrc}
              alt={currentImage.title}
              className={`max-w-full max-h-[80vh] object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setImageError(true);
              }}
            />
          ) : (
            <div className="bg-gray-800 p-8 rounded text-white">
              <p>Failed to load image</p>
            </div>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={navigateNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-5xl font-light"
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <h3 className="text-white text-xl font-semibold">{currentImage.title}</h3>
        <p className="text-white/60 text-sm mt-1">{currentImage.original}</p>
      </div>
    </div>
  );
};

export default ImageViewer;