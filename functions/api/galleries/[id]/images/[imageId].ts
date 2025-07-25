import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
}

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
    const imageId = params.imageId as string;
    const body = await request.json();
    const { title, sort_order } = body;

    // Update image metadata
    await env.DB.prepare(
      'UPDATE gallery_images SET title = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title, sort_order, imageId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return new Response(JSON.stringify({ error: 'Failed to update image' }), {
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
    const imageId = params.imageId as string;

    // Get image details first
    const image = await env.DB.prepare(
      'SELECT * FROM gallery_images WHERE id = ?'
    ).bind(imageId).first();

    if (!image) {
      return new Response(JSON.stringify({ error: 'Image not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete from Cloudflare Images
    if (image.cloudflare_image_id) {
      const deleteResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${image.cloudflare_image_id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`
          }
        }
      );

      if (!deleteResponse.ok) {
        console.error('Failed to delete from Cloudflare Images:', await deleteResponse.text());
      }
    }

    // Delete from database
    await env.DB.prepare('DELETE FROM gallery_images WHERE id = ?').bind(imageId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
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
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};