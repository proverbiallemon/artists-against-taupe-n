import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import galleriesData from '../data/galleries.json';
import ImageViewer from './ImageViewer';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Gallery Header */}
        <div className="mb-8">
          <Link to="/galleries" className="text-primary hover:text-secondary mb-4 inline-block">
            ← Back to Galleries
          </Link>
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

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {validImages.map((image, index) => (
            <div
              key={image.id}
              className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImageIndex(index)}
            >
              {!imageLoadErrors.has(image.id) && image.sizes.thumb ? (
                <>
                  <img
                    src={getImageUrl(image.sizes.thumb)}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={() => handleImageError(image.id)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm truncate">{image.title}</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Image unavailable</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center py-8 border-t border-gray-300">
          <p className="text-gray-600">
            Showing {validImages.length} images
          </p>
        </div>
      </div>

      {/* Image Viewer Lightbox */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={validImages}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
};

export default Gallery;