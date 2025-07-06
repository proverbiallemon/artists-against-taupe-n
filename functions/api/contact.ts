export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    
    console.log('Contact function called');
    console.log('Full context.env:', JSON.stringify(env));
    console.log('Environment variables present:', Object.keys(env));
    console.log('Context keys:', Object.keys(context));
    
    // Check if API key is present
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error - API key missing' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Parse form data
    const formData = await request.formData();
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();
    const turnstileToken = (formData.get('turnstileToken') as string)?.trim();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Security verification required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log('Verifying Turnstile token...');
    console.log('Turnstile secret key present:', !!env.TURNSTILE_SECRET_KEY);
    console.log('Turnstile secret key value:', env.TURNSTILE_SECRET_KEY);
    console.log('Turnstile secret key type:', typeof env.TURNSTILE_SECRET_KEY);
    console.log('Turnstile token received:', !!turnstileToken);
    
    // Check if the secret key is actually set
    if (!env.TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error - Turnstile key missing' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json();
    console.log('Turnstile verification result:', JSON.stringify(turnstileResult));
    
    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult);
      return new Response(JSON.stringify({ error: 'Security verification failed' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log('Sending email with Resend API...');
    console.log('API Key length:', env.RESEND_API_KEY.length);
    console.log('From:', 'contact@artistsagainsttaupe.com');
    console.log('To:', 'tiffanymackerman@gmail.com');
    
    // Send email using Resend
    const emailPayload = {
      from: 'contact@artistsagainsttaupe.com',
      to: ['tiffanymackerman@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Reply directly to: ${email}</small></p>
      `
    };
    
    console.log('Email payload:', JSON.stringify(emailPayload, null, 2));
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      
      let errorMessage = 'Failed to send email';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If not JSON, use the text
        errorMessage = errorText || errorMessage;
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Not an Error object');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return more detailed error info
    return new Response(JSON.stringify({ 
      error: 'Something went wrong',
      details: error instanceof Error ? error.message : String(error),
      type: error?.constructor?.name || typeof error,
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}