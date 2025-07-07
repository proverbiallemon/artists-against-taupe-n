import { Context } from '@cloudflare/workers-types';

interface Env {
  ADMIN_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
}

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
    const formData = await context.request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Generate unique ID for the image
    const imageId = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Upload to Cloudflare Images
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('id', imageId);
    uploadFormData.append('requireSignedURLs', 'false');

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.CLOUDFLARE_API_TOKEN}`
        },
        body: uploadFormData
      }
    );

    const result = await uploadResponse.json();

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Upload failed', details: result }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Return the image URL with transformation variants
    const imageUrl = result.result.variants[0]; // Get the first variant URL
    
    return new Response(JSON.stringify({ 
      success: true,
      url: imageUrl,
      id: imageId,
      variants: result.result.variants
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}