import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGallery, Gallery as GalleryType, GalleryImage } from '../utils/api/galleryApi';
import Breadcrumbs from './Breadcrumbs';
import ProgressiveImage from './ProgressiveImage';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import './ProgressiveImage.css';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { trackGalleryView, trackImageView } from '../utils/gtm';


interface GalleryProps {
  galleryId?: string;
}


const Gallery: React.FC<GalleryProps> = ({ galleryId: propGalleryId }) => {
  const { galleryId: paramGalleryId } = useParams<{ galleryId: string }>();
  const galleryId = propGalleryId || paramGalleryId || '';
  
  const [gallery, setGallery] = useState<GalleryType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const galleryData = await getGallery(galleryId);
        setGallery(galleryData);
        
        // Track gallery view
        if (galleryData) {
          trackGalleryView(galleryData.id, galleryData.title);
        }
      } catch (error) {
        console.error('Failed to load gallery:', error);
        setGallery(null);
      } finally {
        setLoading(false);
      }
    };

    if (galleryId) {
      loadGallery();
    }
  }, [galleryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20 flex items-center justify-center">
        <p className="text-xl">Loading gallery...</p>
      </div>
    );
  }

  if (!gallery || !gallery.images) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20 flex items-center justify-center">
        <p className="text-xl">Gallery not found</p>
      </div>
    );
  }

  // Filter out images that don't have any sizes (failed processing)
  const validImages = gallery.images.filter(img => img.sizes && Object.keys(img.sizes).length > 0);
  
  // Prepare slides for lightbox with optimized URLs
  const slides = validImages.map(image => {
    const imagePath = image.sizes.full || image.sizes.medium || image.sizes.thumb || '';
    return {
      src: getOptimizedImageUrl(imagePath, 'large'),
      alt: image.title,
      title: image.title,
      // srcSet disabled until R2 supports image transformations
      // srcSet: [
      //   {
      //     src: getOptimizedImageUrl(imagePath, 'medium'),
      //     width: 800,
      //     height: 800,
      //   },
      //   {
      //     src: getOptimizedImageUrl(imagePath, 'large'),
      //     width: 1200,
      //     height: 1200,
      //   },
      //   {
      //     src: getOptimizedImageUrl(imagePath, 'full'),
      //     width: 2000,
      //     height: 2000,
      //   },
      // ],
    };
  });

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

        {/* Image Grid - optimized with progressive loading */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-12 -mx-2 px-2 overflow-x-hidden">
          {validImages.map((image, index) => {
            const imagePath = image.sizes.thumb || image.sizes.medium || '';
            
            return (
              <div
                key={image.id}
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-md md:rounded-lg touch-manipulation"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setLightboxOpen(true);
                  // Track image view
                  trackImageView(image.title, gallery.title);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedImageIndex(index);
                    setLightboxOpen(true);
                    // Track image view
                    trackImageView(image.title, gallery.title);
                  }
                }}
              >
                <ProgressiveImage
                  src={imagePath}
                  alt={image.title}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110 group-active:scale-105"
                  sizes="gallery"
                  loading={index < 8 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-active:bg-black/40 transition-colors pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-white text-xs md:text-sm truncate">{image.title}</p>
                </div>
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