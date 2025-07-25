import { Context } from '@cloudflare/workers-types';

interface Env {
  RESEND_API_KEY?: string;
  [key: string]: unknown;
}

export async function onRequestGet(context: Context<Env>) {
  const { env } = context;
  
  // Try different ways to access env vars
  const directEnv = context.env;
  const processEnv = typeof process !== 'undefined' ? process.env : {};
  const contextKeys = Object.keys(context);
  
  // Check if there's a specific binding
  
  // Create debug info
  const debugInfo = {
    timestamp: new Date().toISOString(),
    contextKeys: contextKeys,
    envKeys: Object.keys(env || {}),
    directEnvKeys: Object.keys(directEnv || {}),
    processEnvKeys: Object.keys(processEnv),
    hasResendKey: !!env?.RESEND_API_KEY,
    resendKeyLength: env?.RESEND_API_KEY ? env.RESEND_API_KEY.length : 0,
    resendKeyPrefix: env?.RESEND_API_KEY ? env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    
    // Check all possible locations
    checkLocations: {
      'env.RESEND_API_KEY': !!env?.RESEND_API_KEY,
      'context.RESEND_API_KEY': !!context.RESEND_API_KEY,
      'context.env.RESEND_API_KEY': !!context.env?.RESEND_API_KEY,
      'process.env.RESEND_API_KEY': !!(typeof process !== 'undefined' && process.env?.RESEND_API_KEY),
    },
    
    allEnvVars: env ? Object.keys(env).reduce((acc, key) => {
      // Only show non-sensitive info
      if (key.includes('KEY') || key.includes('TOKEN')) {
        acc[key] = `Set (${env[key] ? env[key].length : 0} chars)`;
      } else {
        acc[key] = env[key];
      }
      return acc;
    }, {} as Record<string, string | number>) : {},
    
    rawContext: Object.keys(context).reduce((acc, key) => {
      if (key !== 'request' && key !== 'env' && key !== 'next') {
        acc[key] = typeof context[key];
      }
      return acc;
    }, {} as Record<string, string>)
  };
  
  return new Response(JSON.stringify(debugInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}