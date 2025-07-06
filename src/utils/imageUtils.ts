// Helper function to get the full image URL for R2 storage
export const getImageUrl = (path: string): string => {
  // If the path is already a full URL (R2), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If R2 base URL is configured, use it
  const r2BaseUrl = import.meta.env.VITE_R2_PUBLIC_URL;
  if (r2BaseUrl) {
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Map different image types to their R2 folder structure
    let r2Path = cleanPath;
    
    // Carousel images: images/carousel* -> carousels/carousel*
    if (cleanPath.startsWith('images/carousel')) {
      r2Path = cleanPath.replace('images/', 'carousels/');
    }
    // Static images (mause, thecrew): keep in static/ folder
    else if (cleanPath.includes('mause/') || cleanPath.includes('thecrew/')) {
      r2Path = cleanPath.replace('images/', 'static/');
    }
    
    return `${r2BaseUrl}/${r2Path}`;
  }
  
  // Otherwise, use local path
  return path;
};

// Image size presets for Cloudflare Image Resizing
export const IMAGE_SIZES = {
  tiny: { width: 50, quality: 30 },    // For blur-up placeholders
  thumb: { width: 200, quality: 80 },   // For grid thumbnails
  thumbLarge: { width: 400, quality: 85 }, // For larger grid views
  medium: { width: 800, quality: 85 },  // For medium displays
  large: { width: 1200, quality: 90 }, // For lightbox/full view
  full: { width: 2000, quality: 90 }    // Maximum size
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  sharpen?: number;
}

// Get optimized image URL
// Note: Since R2 doesn't support image transformations directly,
// we'll use the original URLs but rely on browser-side optimization
export const getOptimizedImageUrl = (
  path: string, 
  _size?: ImageSize | ImageTransformOptions
): string => {
  const baseUrl = getImageUrl(path);
  
  // For now, return the base URL as-is
  // In the future, this could be updated if:
  // 1. Cloudflare adds R2 image transformation support
  // 2. We implement a Worker-based image transformation service
  // 3. We pre-generate different sizes during upload
  return baseUrl;
};

// Generate srcset for responsive images
export const generateSrcSet = (path: string, sizes: ImageSize[] = ['thumb', 'medium', 'large']): string => {
  return sizes
    .map(size => {
      const url = getOptimizedImageUrl(path, size);
      const width = IMAGE_SIZES[size].width;
      return `${url} ${width}w`;
    })
    .join(', ');
};

// Get appropriate sizes attribute based on layout
export const getImageSizes = (layout: 'gallery' | 'hero' | 'thumbnail' | 'full'): string => {
  switch (layout) {
    case 'gallery':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'hero':
      return '100vw';
    case 'thumbnail':
      return '(max-width: 640px) 100px, 200px';
    case 'full':
      return '(max-width: 1200px) 100vw, 1200px';
    default:
      return '100vw';
  }
};