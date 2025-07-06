import React from 'react';

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Picture component that provides WebP images with JPG fallbacks
 * for better browser compatibility (especially older Safari versions)
 */
const Picture: React.FC<PictureProps> = ({ src, alt, className = '', loading = 'lazy' }) => {
  // Check if the src is a WebP image
  const isWebP = src.endsWith('.webp');
  
  if (!isWebP) {
    // If not WebP, just render a regular img
    return <img src={src} alt={alt} className={className} loading={loading} />;
  }
  
  // Generate JPG fallback path by replacing .webp with .jpg
  const jpgSrc = src.replace(/\.webp$/, '.jpg');
  
  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <source srcSet={jpgSrc} type="image/jpeg" />
      <img src={jpgSrc} alt={alt} className={className} loading={loading} />
    </picture>
  );
};

export default Picture;