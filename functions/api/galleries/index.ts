import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    // Get all galleries with image counts
    const { results } = await env.DB.prepare(`
      SELECT 
        g.*,
        COUNT(gi.id) as imageCount
      FROM galleries g
      LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `).all();

    // Get first 3 images for each gallery for preview
    const accountHash = '1oC3yX6npoPvKIv64w5S8g';
    const formattedResults = await Promise.all(results.map(async (gallery: Record<string, unknown>) => {
      // Fetch first 3 images for this gallery
      const { results: images } = await env.DB.prepare(`
        SELECT id, title, cloudflare_image_id, image_url
        FROM gallery_images 
        WHERE gallery_id = ?
        ORDER BY sort_order, created_at
        LIMIT 3
      `).bind(gallery.id).all();

      // Format images with sizes
      const formattedImages = images.map((img: any) => ({
        id: img.id,
        title: img.title,
        original: img.image_url,
        sizes: {
          thumb: `https://imagedelivery.net/${accountHash}/${img.cloudflare_image_id}/w=400,h=300,fit=cover`,
          medium: `https://imagedelivery.net/${accountHash}/${img.cloudflare_image_id}/w=800,h=600,fit=cover`,
          full: img.image_url,
        }
      }));

      return {
        ...gallery,
        images: formattedImages
      };
    }));

    return new Response(JSON.stringify(formattedResults), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch galleries' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Verify admin token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${env.ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { id, title, description, date, location } = body;

    // Validate required fields
    if (!id || !title) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert new gallery
    await env.DB.prepare(
      'INSERT INTO galleries (id, title, description, date, location) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, title, description, date, location).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return new Response(JSON.stringify({ error: 'Failed to create gallery' }), {
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};