import { Context } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
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
    
    const post = results[0] as any;
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