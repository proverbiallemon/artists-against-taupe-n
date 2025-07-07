import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const authHeader = context.request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token !== context.env.ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  const imageId = context.params.id as string;
  
  try {
    // Delete from Cloudflare Images
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${context.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    if (!cfResponse.ok) {
      const error = await cfResponse.text();
      console.error('Cloudflare Images deletion failed:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete image from Cloudflare' }), {
        status: cfResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove from blog_images table if it exists
    try {
      await context.env.DB.prepare(
        'DELETE FROM blog_images WHERE image_id = ?'
      ).bind(imageId).run();
    } catch (e) {
      // Table might not exist yet, which is fine
      console.log('blog_images table might not exist yet');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};