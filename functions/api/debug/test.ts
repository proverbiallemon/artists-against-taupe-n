import { Context } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export async function onRequestGet(context: Context<Env>) {
  try {
    // Check if DB binding exists
    if (!context.env.DB) {
      return new Response(JSON.stringify({ 
        error: 'D1 database binding not found',
        env: Object.keys(context.env)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try to query the database
    const { results } = await context.env.DB.prepare(
      'SELECT COUNT(*) as count FROM blog_posts'
    ).all();

    return new Response(JSON.stringify({ 
      success: true,
      postCount: results[0].count,
      message: 'D1 database connected successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Database query failed',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}