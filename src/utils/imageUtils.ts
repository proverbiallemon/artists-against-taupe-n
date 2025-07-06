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