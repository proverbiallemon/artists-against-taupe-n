export async function onRequestGet(context: {
  env: {
    RESEND_API_KEY: string;
  };
}) {
  const { env } = context;
  
  try {
    console.log('Testing Resend API...');
    
    // First, test the API key by checking domains
    const domainsResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const domainsText = await domainsResponse.text();
    let domains;
    try {
      domains = JSON.parse(domainsText);
    } catch (e) {
      domains = { error: 'Failed to parse domains response', raw: domainsText };
    }
    
    // Try sending a test email
    const testEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['delivered@resend.dev'],
        subject: 'Test from Cloudflare Pages',
        text: 'This is a test email to verify the API key works.',
      }),
    });
    
    const testEmailText = await testEmailResponse.text();
    let testEmailResult;
    try {
      testEmailResult = JSON.parse(testEmailText);
    } catch (e) {
      testEmailResult = { error: 'Failed to parse test email response', raw: testEmailText };
    }
    
    return new Response(JSON.stringify({
      apiKeyLength: env.RESEND_API_KEY?.length || 0,
      apiKeyPrefix: env.RESEND_API_KEY?.substring(0, 10) + '...',
      domains: {
        success: domainsResponse.ok,
        status: domainsResponse.status,
        data: domains,
      },
      testEmail: {
        success: testEmailResponse.ok,
        status: testEmailResponse.status,
        data: testEmailResult,
      },
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Test error:', error);
    return new Response(JSON.stringify({
      error: 'Test failed',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}