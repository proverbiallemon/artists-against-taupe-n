import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const galleryId = params.id as string;

    // Get gallery details
    const gallery = await env.DB.prepare(
      'SELECT * FROM galleries WHERE id = ?'
    ).bind(galleryId).first();

    if (!gallery) {
      return new Response(JSON.stringify({ error: 'Gallery not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get gallery images
    const { results: images } = await env.DB.prepare(
      'SELECT * FROM gallery_images WHERE gallery_id = ? ORDER BY sort_order, created_at'
    ).bind(galleryId).all();

    // Format images for frontend compatibility
    const accountHash = '1oC3yX6npoPvKIv64w5S8g';
    const formattedImages = images.map((img: { 
      id: string; 
      title: string; 
      image_url: string; 
      cloudflare_image_id: string; 
      format?: string 
    }) => ({
      id: img.id,
      title: img.title,
      original: img.image_url,
      sizes: {
        thumb: `https://imagedelivery.net/${accountHash}/${img.cloudflare_image_id}/w=400,h=300,fit=cover`,
        medium: `https://imagedelivery.net/${accountHash}/${img.cloudflare_image_id}/w=800,h=600,fit=cover`,
        full: img.image_url,
      },
      format: img.format || 'standard',
    }));

    return new Response(JSON.stringify({ ...gallery, images: formattedImages }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestPut: PagesFunction<Env> = async ({ request, params, env }) => {
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
    const body = await request.json();
    const { title, description, date, location } = body;

    // Update gallery
    await env.DB.prepare(
      'UPDATE galleries SET title = ?, description = ?, date = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title, description, date, location, galleryId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return new Response(JSON.stringify({ error: 'Failed to update gallery' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, params, env }) => {
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

    // Delete gallery (images will be cascade deleted)
    await env.DB.prepare('DELETE FROM galleries WHERE id = ?').bind(galleryId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete gallery' }), {
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};