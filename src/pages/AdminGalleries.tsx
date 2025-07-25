import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGalleries, Gallery } from '../utils/api/galleryApi';

// Gallery type already includes imageCount from galleryApi

const AdminGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      const galleriesData = await getGalleries();
      // For now, we'll need to fetch each gallery to get image count
      // In the future, we could optimize this by returning count from the galleries endpoint
      setGalleries(galleriesData);
    } catch (error) {
      console.error('Failed to load galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-xl">Loading galleries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Gallery Management</h1>
          <Link
            to="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-2">{gallery.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{gallery.location} • {gallery.date}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{gallery.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {gallery.imageCount} {gallery.imageCount === 1 ? 'image' : 'images'}
                  </span>
                  <Link
                    to={`/admin/galleries/${gallery.id}`}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Manage Images
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {galleries.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No galleries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleries;