import { Context } from '@cloudflare/workers-types';

interface Env {
  ADMIN_PASSWORD: string;
  ADMIN_TOKEN: string;
}

// Security headers
const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Add CORS headers based on origin
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['https://artistsagainsttaupe.com', 'http://localhost:5173'];
  
  if (origin && allowedOrigins.includes(origin)) {
    return { 'Access-Control-Allow-Origin': origin };
  }
  
  // Default to production origin
  return { 'Access-Control-Allow-Origin': 'https://artistsagainsttaupe.com' };
}

export async function onRequestPost(context: Context<Env>) {
  const corsHeaders = getCorsHeaders(context.request);
  
  try {
    const requestData = await context.request.json();
    const { password } = requestData;
    
    // Validate input
    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...securityHeaders, ...corsHeaders }
      });
    }
    
    // Check password length (basic validation)
    if (password.length < 8 || password.length > 128) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { ...securityHeaders, ...corsHeaders }
      });
    }
    
    // Compare password (in production, this should be hashed)
    if (password === context.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true,
        token: context.env.ADMIN_TOKEN 
      }), {
        headers: { ...securityHeaders, ...corsHeaders }
      });
    }
    
    // Generic error message to prevent username enumeration
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Invalid credentials' 
    }), {
      status: 401,
      headers: { ...securityHeaders, ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...securityHeaders, ...corsHeaders }
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