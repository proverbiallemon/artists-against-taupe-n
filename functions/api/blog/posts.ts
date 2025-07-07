import { Context } from '@cloudflare/workers-types';
import { validateBlogPost, sanitizeContent } from '../utils/validation';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
  published: boolean;
  date: string;
  created_at: string;
  updated_at: string;
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

// GET /api/blog/posts - Get all published posts (or all if admin)
export async function onRequestGet(context: Context<Env>) {
  const isAdmin = context.request.headers.get('Authorization') === `Bearer ${context.env.ADMIN_TOKEN}`;
  
  try {
    let query = 'SELECT * FROM blog_posts';
    const params: unknown[] = [];
    
    // Only show published posts to non-admin users
    if (!isAdmin) {
      query += ' WHERE published = ?';
      params.push(1);
    }
    
    query += ' ORDER BY date DESC';
    
    const { results } = await context.env.DB.prepare(query)
      .bind(...params)
      .all();
    
    // Parse tags from JSON string
    const posts = results.map((post: { id: string; slug: string; title: string; author: string; excerpt: string; content: string; tags: string; image?: string; published: number; date: string; created_at: string; updated_at: string; }) => ({
      ...post,
      tags: JSON.parse(post.tags),
      published: !!post.published
    }));
    
    return new Response(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// POST /api/blog/posts - Create a new post (admin only)
export async function onRequestPost(context: Context<Env>) {
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
    const post: BlogPost = await context.request.json();
    
    // Validate input
    const errors = validateBlogPost(post);
    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Sanitize content
    post.content = sanitizeContent(post.content);
    post.excerpt = sanitizeContent(post.excerpt);
    
    // Generate ID if not provided
    if (!post.id) {
      post.id = Date.now().toString();
    }
    
    // Set timestamps
    const now = new Date().toISOString();
    post.created_at = now;
    post.updated_at = now;
    
    // Insert into database
    await context.env.DB.prepare(`
      INSERT INTO blog_posts (
        id, slug, title, author, excerpt, content, tags, 
        image, published, date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      post.id,
      post.slug,
      post.title,
      post.author,
      post.excerpt,
      post.content,
      JSON.stringify(post.tags),
      post.image || null,
      post.published ? 1 : 0,
      post.date,
      post.created_at,
      post.updated_at
    ).run();
    
    // Track images in the content
    await trackImagesForPost(context.env.DB, post.id, post.content);
    
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
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