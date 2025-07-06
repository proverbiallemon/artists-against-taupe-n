import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * SafeImage component that handles WebP/JPG fallbacks
 * Works reliably on Safari iOS
 */
const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Detect Safari iOS
    const isSafariIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) && 
                       /WebKit/i.test(navigator.userAgent) && 
                       !/CriOS/i.test(navigator.userAgent);

    // Check if src is WebP
    if (src.endsWith('.webp')) {
      const jpgSrc = src.replace(/\.webp$/, '.jpg');
      
      if (isSafariIOS) {
        // For Safari iOS, always use JPG
        setImageSrc(jpgSrc);
      } else {
        // For other browsers, test if JPG exists
        const testImg = new Image();
        testImg.onload = () => {
          setImageSrc(jpgSrc);
        };
        testImg.onerror = () => {
          // If JPG doesn't exist, fall back to WebP
          setImageSrc(src);
        };
        testImg.src = jpgSrc;
      }
    } else {
      setImageSrc(src);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError && imageSrc.endsWith('.jpg')) {
      // If JPG failed, try WebP
      setHasError(true);
      setImageSrc(src);
    }
  };

  if (!imageSrc) {
    return null; // Don't render until we have a source
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default SafeImage;