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
    
    // Try sending a test email from default domain
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
    
    // Try sending from custom domain
    const customDomainResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'contact@artistsagainsttaupe.com',
        to: ['artistsagainsttaupe@gmail.com'],
        subject: 'Test from Custom Domain',
        html: '<p>This is a test email from the custom domain.</p>',
        reply_to: 'test@example.com',
      }),
    });
    
    const testEmailText = await testEmailResponse.text();
    let testEmailResult;
    try {
      testEmailResult = JSON.parse(testEmailText);
    } catch (e) {
      testEmailResult = { error: 'Failed to parse test email response', raw: testEmailText };
    }
    
    const customDomainText = await customDomainResponse.text();
    let customDomainResult;
    try {
      customDomainResult = JSON.parse(customDomainText);
    } catch (e) {
      customDomainResult = { error: 'Failed to parse custom domain response', raw: customDomainText };
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
      customDomainEmail: {
        success: customDomainResponse.ok,
        status: customDomainResponse.status,
        data: customDomainResult,
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