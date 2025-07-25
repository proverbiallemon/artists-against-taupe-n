import React from 'react';
import { Link } from 'react-router-dom';
import galleriesData from '../data/galleries.json';
import Breadcrumbs from './Breadcrumbs';
import ProgressiveImage from './ProgressiveImage';
import './ProgressiveImage.css';

interface Gallery {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: {
    id: string;
    title: string;
    sizes?: {
      thumb?: string;
      medium?: string;
      full?: string;
    };
  }[];
}

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
              {/* Preview image - use first 3 thumbnails with progressive loading */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-3 gap-0.5">
                  {gallery.images.slice(0, 3).map((image, idx) => (
                    image.sizes?.thumb && (
                      <ProgressiveImage
                        key={idx}
                        src={image.sizes.thumb}
                        alt={image.title}
                        className="w-full h-full"
                        sizes="thumbnail"
                        loading="lazy"
                      />
                    )
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm pointer-events-none">
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