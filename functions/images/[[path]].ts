// Cloudflare Worker for image optimization and caching
// Handles requests to /images/* and serves optimized images from R2

interface Env {
  R2_BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  
  // Get the image path from the catch-all parameter
  const imagePath = params.path as string;
  
  if (!imagePath) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Parse query parameters for image transformation
  const url = new URL(request.url);
  const width = url.searchParams.get('w');
  // const quality = url.searchParams.get('q') || '85'; // Reserved for future use
  const format = url.searchParams.get('f');
  
  // Generate cache key based on path and parameters
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  
  // Check cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    try {
      // Fetch original image from R2
      const objectKey = `gallery-v2/${imagePath}`;
      const object = await env.R2_BUCKET.get(objectKey);
      
      if (!object) {
        return new Response('Image not found', { status: 404 });
      }
      
      // Get the image data
      const imageBuffer = await object.arrayBuffer();
      
      // Set up headers
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
      
      // Set aggressive caching headers
      headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
      headers.set('CDN-Cache-Control', 'max-age=31536000'); // 1 year at CDN
      headers.set('ETag', object.httpEtag || '');
      
      // Add CORS headers
      headers.set('Access-Control-Allow-Origin', '*');
      
      // If no transformation requested, return original
      if (!width && !format) {
        response = new Response(imageBuffer, {
          status: 200,
          headers,
        });
      } else {
        // For now, return original image
        // In production, you would use Cloudflare Image Resizing here
        // or implement WebAssembly-based image processing
        response = new Response(imageBuffer, {
          status: 200,
          headers,
        });
      }
      
      // Store in cache
      context.waitUntil(cache.put(cacheKey, response.clone()));
      
    } catch (error) {
      console.error('Error fetching image:', error);
      return new Response('Error fetching image', { status: 500 });
    }
  }
  
  return response;
};

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}