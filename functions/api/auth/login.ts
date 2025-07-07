import { Context } from '@cloudflare/workers-types';

interface Env {
  ADMIN_PASSWORD: string;
  ADMIN_TOKEN: string;
}

export async function onRequestPost(context: Context<Env>) {
  try {
    const { password } = await context.request.json();
    
    if (password === context.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true,
        token: context.env.ADMIN_TOKEN 
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Invalid password' 
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}