import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the security check');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('turnstileToken', turnstileToken);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <section id="contact" className="scroll-mt-20 max-w-screen-lg mx-auto bg-gray-100 rounded-lg shadow-lg p-8 my-8 text-gray-800">
        <p className="text-center text-green-600 font-bold text-xl">Thanks for your message!</p>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-20 max-w-screen-lg mx-auto bg-gray-100 rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <h2 className="text-4xl font-bold text-primary mb-6">Join the Movement</h2>
      <p className="mb-4 font-bold">We'd love to hear from you. Fill out the form below:</p>
      <form id="fs-frm" onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="First and Last"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
          ></textarea>
        </div>

        {/* Turnstile Widget */}
        <div className="flex justify-center">
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => {
              setErrorMessage('Security check failed. Please try again.');
              setTurnstileToken(null);
            }}
            onExpire={() => setTurnstileToken(null)}
          />
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="text-red-500 text-sm font-bold">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </section>
  );
}

function App() {
  return <ContactForm />;
}

export default App;