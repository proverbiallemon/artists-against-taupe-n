import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-screen-lg mx-auto p-5">
        <h1 className="text-5xl font-bold text-primary mb-8">Join the Movement</h1>
        
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 mb-8">
          <p className="text-xl mb-8 text-gray-800">
            Ready to bring color and life to institutional spaces? Whether you're an artist, 
            an organization looking to transform your space, or someone who wants to support 
            our mission, we'd love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">For Artists</h2>
              <p className="text-gray-700">
                Join our growing community of revolutionaries who are changing the look of help. 
                We welcome artists of all backgrounds and experience levels.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">For Organizations</h2>
              <p className="text-gray-700">
                Transform your institutional spaces into environments that inspire hope and healing. 
                Let's discuss how we can bring the Artists Against Taupe vision to your facility.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;