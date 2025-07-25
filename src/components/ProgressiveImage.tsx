import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: 'gallery' | 'hero' | 'thumbnail' | 'full';
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = 'gallery',
  onClick,
  loading = 'lazy',
  onError
}) => {
  // Mark sizes as intentionally unused for now
  void sizes;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        rootMargin: '50px',
        threshold: 0.01 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  // Add delay to show animation
  useEffect(() => {
    if (isInView && !showImage) {
      // Wait for 1.2 seconds (one full animation cycle) before showing the image
      animationTimerRef.current = setTimeout(() => {
        setShowImage(true);
      }, 1200);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isInView, showImage]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Generate optimized URLs
  const tinyUrl = getOptimizedImageUrl(src, 'tiny');
  const thumbUrl = getOptimizedImageUrl(src, 'thumb');
  // const srcSet = generateSrcSet(src, ['thumb', 'thumbLarge', 'medium', 'large']); // Disabled until R2 supports transformations
  // const sizesAttr = getImageSizes(sizes); // Disabled until R2 supports transformations

  if (error) {
    return (
      <div 
        ref={containerRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <span className="text-gray-500 text-sm px-4 text-center">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Blur placeholder */}
      {showImage && !isLoaded && (
        <img
          src={tinyUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {showImage && (
        <img
          ref={imgRef}
          src={thumbUrl}
          // srcSet={srcSet} // Disabled until R2 supports image transformations
          // sizes={sizesAttr} // Disabled until R2 supports image transformations
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}

      {/* Loading animation with 502mause - show until image is loaded */}
      {isInView && (!showImage || !isLoaded) && (
        <div className="absolute inset-0 overflow-hidden bg-gray-200">
          <div 
            className="absolute h-12 w-12 animate-slide-across"
            style={{ top: '50%', marginTop: '-24px' }}
          >
            <img 
              src="/favicon.svg" 
              alt=""
              className="w-full h-full opacity-60 animate-spin-slow"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;