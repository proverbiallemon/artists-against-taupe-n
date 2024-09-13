import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createContact } from '../graphql/mutations';
import { CreateContactInput } from '../API';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const contactInput: CreateContactInput = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    // Include the message in the mutation variables
    const variables = {
      input: contactInput,
      message, // Add the message here
    };

    try {
      const result = await client.graphql({
        query: createContact,
        variables: variables,
      });

      console.log('Contact created:', result.data?.createContact);
      setSubmitMessage('Thank you! Your message has been submitted.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error creating contact:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm p-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {submitMessage && (
        <p className={`mt-4 text-center ${submitMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {submitMessage}
        </p>
      )}
    </div>
  );
};

export default ContactForm;