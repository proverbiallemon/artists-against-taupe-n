import { Context } from '@cloudflare/workers-types';

interface Env {
  ADMIN_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
}

export async function onRequestGet(context: Context<Env>) {
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

  // Return available environment variables (without exposing actual values)
  return new Response(JSON.stringify({
    hasAdminToken: !!context.env.ADMIN_TOKEN,
    hasCloudflareAccountId: !!context.env.CLOUDFLARE_ACCOUNT_ID,
    hasCloudflareApiToken: !!context.env.CLOUDFLARE_API_TOKEN,
    accountIdLength: context.env.CLOUDFLARE_ACCOUNT_ID?.length || 0,
    apiTokenLength: context.env.CLOUDFLARE_API_TOKEN?.length || 0,
    // Show first 4 chars of account ID for verification
    accountIdPreview: context.env.CLOUDFLARE_ACCOUNT_ID?.substring(0, 4) + '...',
    allEnvKeys: Object.keys(context.env)
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}