export async function onRequestPost(context: {
  request: Request;
  env: {
    RESEND_API_KEY: string;
  };
}) {
  try {
    const { request, env } = context;
    
    console.log('Contact function called');
    console.log('Environment variables present:', Object.keys(env));
    
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
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

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

    console.log('Sending email with Resend API...');
    console.log('API Key length:', env.RESEND_API_KEY.length);
    console.log('From:', 'contact@artistsagainsttaupe.com');
    console.log('To:', 'artistsagainsttaupe@gmail.com');
    
    // Send email using Resend
    const emailPayload = {
      from: 'Artists Against Taupe <contact@artistsagainsttaupe.com>',
      to: ['artistsagainsttaupe@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      reply_to: email,
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