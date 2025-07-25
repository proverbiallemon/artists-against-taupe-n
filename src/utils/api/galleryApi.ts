import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://artistsagainsttaupe.com/api' 
  : 'http://localhost:8788/api';

export interface Gallery {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images?: GalleryImage[];
  imageCount?: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  original: string;
  sizes: {
    thumb?: string;
    medium?: string;
    full?: string;
  };
  format?: string;
}

// Get all galleries
export async function getGalleries(): Promise<Gallery[]> {
  const response = await fetch(`${API_BASE_URL}/galleries`);
  if (!response.ok) {
    throw new Error('Failed to fetch galleries');
  }
  return response.json();
}

// Get single gallery with images
export async function getGallery(galleryId: string): Promise<Gallery> {
  const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery');
  }
  return response.json();
}

// Upload images to gallery
export async function uploadGalleryImages(galleryId: string, files: File[]): Promise<GalleryImage[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}/images/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload images');
  }

  const result = await response.json();
  return result.images;
}

// Delete gallery image
export async function deleteGalleryImage(galleryId: string, imageId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}/images/${imageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
}

// Reorder gallery images
export async function reorderGalleryImages(
  galleryId: string, 
  reorderedImages: { imageId: string; newOrder: number }[]
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/galleries/${galleryId}/images/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ reorderedImages }),
  });

  if (!response.ok) {
    throw new Error('Failed to reorder images');
  }
}