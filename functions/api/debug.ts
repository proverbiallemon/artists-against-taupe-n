export async function onRequestGet(context: {
  request: Request;
  env: Record<string, any>;
}) {
  const { env } = context;
  
  // Create debug info
  const debugInfo = {
    timestamp: new Date().toISOString(),
    deployTime: '2025-07-04T20:45:00Z',
    envKeys: Object.keys(env),
    hasResendKey: !!env.RESEND_API_KEY,
    resendKeyLength: env.RESEND_API_KEY ? env.RESEND_API_KEY.length : 0,
    resendKeyPrefix: env.RESEND_API_KEY ? env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    allEnvVars: Object.keys(env).reduce((acc, key) => {
      // Only show non-sensitive info
      if (key.includes('KEY') || key.includes('TOKEN')) {
        acc[key] = `Set (${env[key] ? env[key].length : 0} chars)`;
      } else {
        acc[key] = env[key];
      }
      return acc;
    }, {} as Record<string, any>),
    cfInfo: {
      hasAssetsFetch: !!env.ASSETS,
      hasCfObject: !!context.env.CF,
    }
  };
  
  return new Response(JSON.stringify(debugInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}