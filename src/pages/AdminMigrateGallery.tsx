import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import galleriesData from '../data/galleries.json';
import { uploadGalleryImages } from '../utils/api/galleryApi';

interface MigrationStatus {
  totalImages: number;
  processed: number;
  succeeded: number;
  failed: number;
  currentImage?: string;
  errors: string[];
  isRunning: boolean;
}

const AdminMigrateGallery: React.FC = () => {
  const [status, setStatus] = useState<MigrationStatus>({
    totalImages: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [],
    isRunning: false,
  });

  const downloadImageAsBlob = async (url: string): Promise<File> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  };

  const startMigration = async () => {
    const gallery = galleriesData.galleries[0]; // Safe Place Louisville
    const totalImages = gallery.images.length;

    setStatus({
      totalImages,
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [],
      isRunning: true,
    });

    // Process in batches
    const batchSize = 3;
    
    for (let i = 0; i < gallery.images.length; i += batchSize) {
      const batch = gallery.images.slice(i, i + batchSize);
      
      for (const image of batch) {
        setStatus(prev => ({
          ...prev,
          currentImage: image.title,
        }));

        try {
          // Get the best quality image URL
          const imageUrl = image.sizes.full || image.sizes.medium || image.sizes.thumb || image.original;
          const fullUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `https://images.artistsagainsttaupe.com/${imageUrl}`;

          // Download and convert to File
          const file = await downloadImageAsBlob(fullUrl);
          
          // Upload to Cloudflare Images via our API
          await uploadGalleryImages(gallery.id, [file]);

          setStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            succeeded: prev.succeeded + 1,
          }));

        } catch (error) {
          const errorMessage = `Failed to migrate ${image.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          
          setStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            errors: [...prev.errors, errorMessage],
          }));
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Longer delay between batches
      if (i + batchSize < gallery.images.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setStatus(prev => ({
      ...prev,
      isRunning: false,
      currentImage: undefined,
    }));
  };

  const progressPercentage = status.totalImages > 0 
    ? Math.round((status.processed / status.totalImages) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Gallery Migration Tool</h1>
          <Link
            to="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Migrate R2 Images to Cloudflare Images</h2>
            <p className="text-gray-600">
              This tool will migrate all gallery images from R2 storage to Cloudflare Images 
              and update the database.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Gallery: Safe Place Louisville ({galleriesData.galleries[0].images.length} images)
            </p>
          </div>

          {!status.isRunning && status.processed === 0 && (
            <button
              onClick={startMigration}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Migration
            </button>
          )}

          {(status.isRunning || status.processed > 0) && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress: {status.processed} / {status.totalImages}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Current Status */}
              {status.currentImage && (
                <div className="text-sm text-gray-600">
                  Currently processing: <span className="font-medium">{status.currentImage}</span>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{status.processed}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{status.succeeded}</div>
                  <div className="text-sm text-gray-600">Succeeded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{status.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>

              {/* Errors */}
              {status.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-red-600 mb-2">Errors:</h3>
                  <div className="bg-red-50 rounded p-3 max-h-40 overflow-y-auto">
                    {status.errors.map((error, index) => (
                      <div key={index} className="text-xs text-red-800 mb-1">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Message */}
              {!status.isRunning && status.processed === status.totalImages && (
                <div className={`rounded-lg p-4 ${
                  status.failed === 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  <p className="font-semibold">
                    Migration Complete!
                  </p>
                  <p className="text-sm mt-1">
                    Successfully migrated {status.succeeded} of {status.totalImages} images.
                  </p>
                  {status.failed > 0 && (
                    <p className="text-sm mt-1">
                      {status.failed} images failed to migrate. Check the errors above.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>This process may take several minutes depending on the number of images</li>
            <li>Do not close this page while migration is in progress</li>
            <li>Images are uploaded in small batches to avoid timeouts</li>
            <li>Once migrated, images will be served from Cloudflare Images CDN</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminMigrateGallery;