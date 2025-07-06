import React from 'react';
import { Link } from 'react-router-dom';
import galleriesData from '../data/galleries.json';
import Breadcrumbs from './Breadcrumbs';

interface Gallery {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: any[];
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

const GalleryList: React.FC = () => {
  const galleries = galleriesData.galleries as Gallery[];

  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-7xl mx-auto px-5">
        <Breadcrumbs 
          items={[
            { label: 'Home', path: '/' },
            { label: 'Galleries' }
          ]} 
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          Art Takeovers
        </h1>
        <p className="text-lg mb-12 max-w-3xl">
          Artists Against Taupe transforms institutional spaces through vibrant murals and artwork. 
          Explore our gallery of completed projects that bring color, joy, and hope to communities.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              to={`/galleries/${gallery.id}`}
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Preview image - use first 3 thumbnails */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-3 gap-0.5">
                  {gallery.images.slice(0, 3).map((image, idx) => (
                    image.sizes?.thumb && (
                      <img
                        key={idx}
                        src={getImageUrl(image.sizes.thumb)}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {gallery.images.length} photos
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                  {gallery.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {gallery.location} • {gallery.date}
                </p>
                <p className="mt-3 text-gray-700 line-clamp-2">
                  {gallery.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryList;