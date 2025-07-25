import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
}

// Generate a unique ID
function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, params, env }) => {
  // Verify admin token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${env.ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const galleryId = params.id as string;

    // Verify gallery exists
    const gallery = await env.DB.prepare(
      'SELECT id FROM galleries WHERE id = ?'
    ).bind(galleryId).first();

    if (!gallery) {
      return new Response(JSON.stringify({ error: 'Gallery not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const uploadedImages = [];
    const accountHash = '1oC3yX6npoPvKIv64w5S8g';

    for (const file of files) {
      // Upload to Cloudflare Images
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('requireSignedURLs', 'false');

      const uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`
          },
          body: uploadFormData
        }
      );

      const result = await uploadResponse.json() as { 
      success: boolean; 
      result?: { id: string }; 
      errors?: unknown[] 
    };

      if (!result.success) {
        console.error('Cloudflare Images API error:', result);
        return new Response(JSON.stringify({ 
          error: 'Upload failed', 
          details: result.errors || result,
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const imageId = generateId();
      const cloudflareImageId = result.result.id;
      const imageUrl = `https://imagedelivery.net/${accountHash}/${cloudflareImageId}/public`;

      // Get current max sort order
      const maxSortOrder = await env.DB.prepare(
        'SELECT MAX(sort_order) as max_order FROM gallery_images WHERE gallery_id = ?'
      ).bind(galleryId).first() as { max_order: number | null };

      const sortOrder = (maxSortOrder?.max_order || 0) + 1;

      // Insert into database
      await env.DB.prepare(
        `INSERT INTO gallery_images (
          id, gallery_id, original_filename, title, cloudflare_image_id, 
          image_url, format, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        imageId,
        galleryId,
        file.name,
        file.name.replace(/\.[^/.]+$/, ''), // Remove extension for title
        cloudflareImageId,
        imageUrl,
        'standard',
        sortOrder
      ).run();

      uploadedImages.push({
        id: imageId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        original: imageUrl,
        sizes: {
          thumb: `https://imagedelivery.net/${accountHash}/${cloudflareImageId}/thumbnail`,
          medium: `https://imagedelivery.net/${accountHash}/${cloudflareImageId}/blog`,
          full: imageUrl,
        },
        format: 'standard',
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      images: uploadedImages 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload images' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};