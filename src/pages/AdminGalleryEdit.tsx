import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { getGallery, uploadGalleryImages, deleteGalleryImage, reorderGalleryImages, Gallery, GalleryImage } from '../utils/api/galleryApi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  image: GalleryImage;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableImage: React.FC<SortableImageProps> = ({ image, isSelected, isDeleting, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const imagePath = image.sizes.thumb || image.sizes.medium || image.original;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-lg overflow-hidden shadow-md transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="aspect-square relative" {...attributes} {...listeners}>
        <img
          src={getOptimizedImageUrl(imagePath, 'medium')}
          alt={image.title}
          className="w-full h-full object-cover cursor-move"
        />
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-primary cursor-pointer"
            disabled={isDeleting}
          />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors pointer-events-auto"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Image Title */}
      <div className="p-2">
        <p className="text-sm text-gray-700 truncate" title={image.title}>
          {image.title}
        </p>
      </div>
    </div>
  );
};

const AdminGalleryEdit: React.FC = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const loadGallery = useCallback(async () => {
    try {
      const galleryData = await getGallery(galleryId!);
      setGallery(galleryData);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    loadGallery();
  }, [galleryId, loadGallery]);

  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (gallery) {
      if (selectedImages.size === gallery.images?.length) {
        setSelectedImages(new Set());
      } else {
        setSelectedImages(new Set(gallery.images?.map(img => img.id) || []));
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleteLoading(imageId);
    try {
      await deleteGalleryImage(galleryId!, imageId);
      if (gallery) {
        const updatedImages = gallery.images!.filter(img => img.id !== imageId);
        setGallery({ ...gallery, images: updatedImages });
        setSelectedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedImages.size} images?`)) {
      return;
    }

    try {
      // Delete all selected images
      const deletePromises = Array.from(selectedImages).map(imageId => 
        deleteGalleryImage(galleryId!, imageId)
      );
      await Promise.all(deletePromises);

      if (gallery) {
        const updatedImages = gallery.images!.filter(img => !selectedImages.has(img.id));
        setGallery({ ...gallery, images: updatedImages });
        setSelectedImages(new Set());
      }
    } catch (error) {
      console.error('Failed to delete images:', error);
      alert('Failed to delete images');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);
    try {
      const uploadedImages = await uploadGalleryImages(galleryId!, Array.from(files));
      if (gallery) {
        setGallery({ ...gallery, images: [...(gallery.images || []), ...uploadedImages] });
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && gallery?.images) {
      const oldIndex = gallery.images.findIndex((img) => img.id === active.id);
      const newIndex = gallery.images.findIndex((img) => img.id === over?.id);

      const newImages = arrayMove(gallery.images, oldIndex, newIndex);
      setGallery({ ...gallery, images: newImages });

      // Update sort order in database
      const reorderedImages = newImages.map((img, index) => ({
        imageId: img.id,
        newOrder: index
      }));

      try {
        await reorderGalleryImages(galleryId!, reorderedImages);
      } catch (error) {
        console.error('Failed to save new order:', error);
        // Revert on error
        await loadGallery();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-xl">Loading gallery...</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Gallery not found</p>
          <Link to="/admin/galleries" className="text-primary hover:underline">
            Back to galleries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">{gallery.title}</h1>
            <p className="text-gray-600 mt-1">{gallery.location} • {gallery.date}</p>
          </div>
          <Link
            to="/admin/galleries"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Galleries
          </Link>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedImages.size === gallery.images?.length && (gallery.images?.length || 0) > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">
                {selectedImages.size > 0
                  ? `${selectedImages.size} selected`
                  : 'Select all'}
              </span>
            </label>
            {selectedImages.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete Selected
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {gallery.images?.length || 0} images
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        </div>

        {/* Image Grid with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={gallery.images?.map(img => img.id) || []}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {gallery.images?.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  isSelected={selectedImages.has(image.id)}
                  isDeleting={deleteLoading === image.id}
                  onSelect={() => handleImageSelect(image.id)}
                  onDelete={() => handleDeleteImage(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {(!gallery.images || gallery.images.length === 0) && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No images in this gallery yet.</p>
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Uploading...' : 'Upload First Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryEdit;