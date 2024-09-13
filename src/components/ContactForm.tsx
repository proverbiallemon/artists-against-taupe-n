// src/components/ContactForm.tsx
import React, { useState } from 'react';


const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setStatus('Invalid email address.');
      return;
    }

    setStatus('Sending...');

    try {
      const response = await fetch('https://8iz3ddn1kg.execute-api.us-east-2.amazonaws.com/ProdDep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        // Reset the form and status message on success
        setStatus('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred while sending your message. Please check your connection and try again later.');
    }
  };

  return (
    <section id="contact" className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Join the Movement</h2>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex flex-wrap -mx-2 mb-6">
            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded-lg text-lg font-semibold bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div className="w-full md:w-1/2 px-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 rounded-lg text-lg font-semibold bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
              />
            </div>
          </div>
          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              required
              className="w-full px-4 py-3 rounded-lg text-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 h-40 resize-none"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={status === 'Sending...'} // Disable the button when sending
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 ${status === 'Sending...' && 'cursor-not-allowed opacity-50'}`}
            >
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
        {status && <p className="text-center mt-4 text-lg font-semibold">{status}</p>}
      </div>
    </section>
  );
};

export default ContactForm;
