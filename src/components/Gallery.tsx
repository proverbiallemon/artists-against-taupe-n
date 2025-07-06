import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import galleriesData from '../data/galleries.json';
import Breadcrumbs from './Breadcrumbs';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

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

interface GalleryData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: GalleryImage[];
}

interface GalleryProps {
  galleryId?: string;
}

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
    return `${r2BaseUrl}/${cleanPath}`;
  }
  
  // Otherwise, use local path
  return path;
};

const Gallery: React.FC<GalleryProps> = ({ galleryId: propGalleryId }) => {
  const { galleryId: paramGalleryId } = useParams<{ galleryId: string }>();
  const galleryId = propGalleryId || paramGalleryId || '';
  
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const foundGallery = galleriesData.galleries.find(g => g.id === galleryId) as GalleryData;
    setGallery(foundGallery || null);
  }, [galleryId]);

  const handleImageError = (imageId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(imageId));
  };

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20 flex items-center justify-center">
        <p className="text-xl">Gallery not found</p>
      </div>
    );
  }

  // Filter out images that don't have any sizes (failed processing)
  const validImages = gallery.images.filter(img => img.sizes && Object.keys(img.sizes).length > 0);
  
  // Prepare slides for lightbox
  const slides = validImages.map(image => ({
    src: getImageUrl(image.sizes.full || image.sizes.medium || image.sizes.thumb || ''),
    alt: image.title,
    title: image.title,
    srcSet: [
      {
        src: getImageUrl(image.sizes.thumb || ''),
        width: 400,
        height: 400,
      },
      {
        src: getImageUrl(image.sizes.medium || image.sizes.thumb || ''),
        width: 800,
        height: 800,
      },
      {
        src: getImageUrl(image.sizes.full || image.sizes.medium || image.sizes.thumb || ''),
        width: 1200,
        height: 1200,
      },
    ],
  }));

  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', path: '/' },
            { label: 'Galleries', path: '/galleries' },
            { label: gallery.title }
          ]} 
        />
        
        {/* Gallery Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {gallery.title}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {gallery.location} • {gallery.date}
          </p>
          <p className="text-lg max-w-3xl">
            {gallery.description}
          </p>
        </div>

        {/* Image Grid - optimized touch targets for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-12 -mx-2 px-2 overflow-x-hidden">
          {validImages.map((image, index) => {
            // Generate srcset for responsive images
            const thumbUrl = getImageUrl(image.sizes.thumb || '');
            const mediumUrl = getImageUrl(image.sizes.medium || image.sizes.thumb || '');
            const fullUrl = getImageUrl(image.sizes.full || image.sizes.medium || image.sizes.thumb || '');
            
            // Create srcset string for different screen sizes
            const srcSet = `
              ${thumbUrl}?w=400 400w,
              ${mediumUrl}?w=800 800w,
              ${fullUrl}?w=1200 1200w
            `.trim();
            
            return (
              <div
                key={image.id}
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-md md:rounded-lg touch-manipulation"
                onClick={() => {
                  setSelectedImageIndex(index);
                  setLightboxOpen(true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedImageIndex(index);
                    setLightboxOpen(true);
                  }
                }}
              >
                {!imageLoadErrors.has(image.id) && image.sizes.thumb ? (
                  <>
                    <img
                      src={thumbUrl}
                      srcSet={srcSet}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-105"
                      onError={() => handleImageError(image.id)}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-active:bg-black/40 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs md:text-sm truncate">{image.title}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Image unavailable</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="text-center py-8 border-t border-gray-300">
          <p className="text-gray-600">
            Showing {validImages.length} images
          </p>
        </div>
      </div>

      {/* Yet Another React Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedImageIndex}
        slides={slides}
        plugins={[Zoom, Captions]}
        carousel={{
          finite: false,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
          doubleClickMaxStops: 2,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: 'center',
        }}
      />
    </div>
  );
};

export default Gallery;