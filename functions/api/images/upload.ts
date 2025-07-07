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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Check if required environment variables are present
    if (!context.env.CLOUDFLARE_ACCOUNT_ID || !context.env.CLOUDFLARE_API_TOKEN) {
      return new Response(JSON.stringify({ 
        error: 'Missing configuration',
        details: 'CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

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

    // Upload to Cloudflare Images
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
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

    const result = await uploadResponse.json() as any;

    if (!result.success) {
      console.error('Cloudflare Images API error:', result);
      return new Response(JSON.stringify({ 
        error: 'Upload failed', 
        details: result.errors || result,
        status: uploadResponse.status
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Build the image URL using the account hash
    const accountHash = '1oC3yX6npoPvKIv64w5S8g';
    const imageUrl = `https://imagedelivery.net/${accountHash}/${result.result.id}/public`;
    
    return new Response(JSON.stringify({ 
      success: true,
      url: imageUrl,
      id: result.result.id,
      variants: {
        public: `https://imagedelivery.net/${accountHash}/${result.result.id}/public`,
        thumbnail: `https://imagedelivery.net/${accountHash}/${result.result.id}/thumbnail`,
        blog: `https://imagedelivery.net/${accountHash}/${result.result.id}/blog`
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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