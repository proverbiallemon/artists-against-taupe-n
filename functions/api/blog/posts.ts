import { Context } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
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

// GET /api/blog/posts - Get all published posts (or all if admin)
export async function onRequestGet(context: Context<Env>) {
  const url = new URL(context.request.url);
  const isAdmin = context.request.headers.get('Authorization') === `Bearer ${context.env.ADMIN_TOKEN}`;
  
  try {
    let query = 'SELECT * FROM blog_posts';
    const params: any[] = [];
    
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
    const posts = results.map((post: any) => ({
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