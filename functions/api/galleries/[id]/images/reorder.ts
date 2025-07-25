import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

interface ReorderRequest {
  imageId: string;
  newOrder: number;
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
    const body = await request.json();
    const { reorderedImages } = body as { reorderedImages: ReorderRequest[] };

    if (!reorderedImages || !Array.isArray(reorderedImages)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update all image orders in a transaction-like manner
    for (const { imageId, newOrder } of reorderedImages) {
      await env.DB.prepare(
        'UPDATE gallery_images SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND gallery_id = ?'
      ).bind(newOrder, imageId, galleryId).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error reordering images:', error);
    return new Response(JSON.stringify({ error: 'Failed to reorder images' }), {
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