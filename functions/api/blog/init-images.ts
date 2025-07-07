import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const authHeader = context.request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token !== context.env.ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Create blog_images table if it doesn't exist
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blog_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        image_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
      )
    `).run();

    // Create index for faster lookups
    await context.env.DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_blog_images_post_id ON blog_images(post_id)
    `).run();

    await context.env.DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_blog_images_image_id ON blog_images(image_id)
    `).run();

    return new Response(JSON.stringify({ success: true, message: 'Blog images table initialized' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error initializing blog images table:', error);
    return new Response(JSON.stringify({ error: 'Failed to initialize table' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};