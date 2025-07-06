import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, generateSrcSet, getImageSizes } from '../utils/imageUtils';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const srcSet = generateSrcSet(src, ['thumb', 'thumbLarge', 'medium', 'large']);
  const sizesAttr = getImageSizes(sizes);

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
      {isInView && !isLoaded && (
        <img
          src={tinyUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={thumbUrl}
          srcSet={srcSet}
          sizes={sizesAttr}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}

      {/* Loading shimmer */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      )}
    </div>
  );
};

export default ProgressiveImage;