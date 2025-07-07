import { Context } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

// Helper function to extract Cloudflare image IDs from content
function extractCloudflareImages(content: string): { id: string; url: string }[] {
  const images: { id: string; url: string }[] = [];
  const regex = /https:\/\/imagedelivery\.net\/[^/]+\/([^/]+)\/[^"'\s)]+/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    images.push({
      id: match[1],
      url: match[0]
    });
  }
  
  return images;
}

// Helper function to ensure blog_images table exists
async function ensureBlogImagesTable(db: D1Database): Promise<void> {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS blog_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        image_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
      )
    `).run();
    
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_blog_images_post_id ON blog_images(post_id)
    `).run();
    
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_blog_images_image_id ON blog_images(image_id)
    `).run();
  } catch (error) {
    console.error('Error ensuring blog_images table:', error);
  }
}

// Helper function to track images for a post
async function trackImagesForPost(db: D1Database, postId: string, content: string): Promise<void> {
  await ensureBlogImagesTable(db);
  
  const images = extractCloudflareImages(content);
  
  // First, clear existing image associations for this post
  await db.prepare('DELETE FROM blog_images WHERE post_id = ?').bind(postId).run();
  
  // Then, add new associations
  for (const image of images) {
    await db.prepare(
      'INSERT INTO blog_images (post_id, image_id, image_url) VALUES (?, ?, ?)'
    ).bind(postId, image.id, image.url).run();
  }
}

// Helper function to clean up orphaned images
async function cleanupOrphanedImages(db: D1Database, postId: string, env: Env): Promise<void> {
  try {
    // Get all images associated with this post
    const { results } = await db.prepare(
      'SELECT DISTINCT image_id FROM blog_images WHERE post_id = ?'
    ).bind(postId).all();
    
    for (const row of results) {
      const imageId = (row as { image_id: string }).image_id;
      
      // Check if this image is used by any other posts
      const { results: otherPosts } = await db.prepare(
        'SELECT COUNT(*) as count FROM blog_images WHERE image_id = ? AND post_id != ?'
      ).bind(imageId, postId).all();
      
      const count = (otherPosts[0] as { count: number }).count;
      
      // If not used by other posts, delete from Cloudflare
      if (count === 0) {
        try {
          await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
            {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
              },
            }
          );
          console.log(`Deleted orphaned image: ${imageId}`);
        } catch (error) {
          console.error(`Failed to delete image ${imageId}:`, error);
        }
      }
    }
    
    // Remove image associations for this post
    await db.prepare('DELETE FROM blog_images WHERE post_id = ?').bind(postId).run();
  } catch (error) {
    console.error('Error cleaning up images:', error);
  }
}

// GET /api/blog/:id - Get a single post
export async function onRequestGet(context: Context<Env>) {
  const id = context.params.id as string;
  
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM blog_posts WHERE id = ? OR slug = ?'
    ).bind(id, id).all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const post = results[0] as { tags: string; published: number; id: string; slug: string; title: string; author: string; excerpt: string; content: string; image?: string; date: string; created_at: string; updated_at: string; };
    post.tags = JSON.parse(post.tags);
    post.published = !!post.published;
    
    return new Response(JSON.stringify(post), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// PUT /api/blog/:id - Update a post (admin only)
export async function onRequestPut(context: Context<Env>) {
  const id = context.params.id as string;
  
  // Check authentication
  if (context.request.headers.get('Authorization') !== `Bearer ${context.env.ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  try {
    const updates = await context.request.json();
    updates.updated_at = new Date().toISOString();
    
    // Convert tags array to JSON string
    if (updates.tags && Array.isArray(updates.tags)) {
      updates.tags = JSON.stringify(updates.tags);
    }
    
    // Convert boolean to integer for SQLite
    if (typeof updates.published === 'boolean') {
      updates.published = updates.published ? 1 : 0;
    }
    
    await context.env.DB.prepare(`
      UPDATE blog_posts 
      SET slug = ?, title = ?, author = ?, excerpt = ?, content = ?, 
          tags = ?, image = ?, published = ?, date = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      updates.slug,
      updates.title,
      updates.author,
      updates.excerpt,
      updates.content,
      updates.tags,
      updates.image || null,
      updates.published,
      updates.date,
      updates.updated_at,
      id
    ).run();
    
    // Track images in the updated content
    await trackImagesForPost(context.env.DB, id, updates.content);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// DELETE /api/blog/:id - Delete a post (admin only)
export async function onRequestDelete(context: Context<Env>) {
  const id = context.params.id as string;
  
  // Check authentication
  if (context.request.headers.get('Authorization') !== `Bearer ${context.env.ADMIN_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  try {
    // Clean up orphaned images before deleting the post
    await cleanupOrphanedImages(context.env.DB, id, context.env);
    
    await context.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?')
      .bind(id)
      .run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// OPTIONS - Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}