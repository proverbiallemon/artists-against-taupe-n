import React from 'react';

const SpotlightFeature: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 my-12 shadow-md text-center">
      <h3 className="text-4xl font-bold text-primary mb-4">In the Spotlight</h3>
      <p className="mb-4 font-bold text-gray-700">
        Learn more about how Tiffany Ackerman and the Artists Against Taupe project
        are transforming Safe Place Shelter and paving the way for more colorful, 
        inspiring spaces across Louisville.
      </p>
      <a
        href="https://canvasrebel.com/conversations-with-tiffany-ackerman/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
      >
        Read the Full Story
      </a>
    </div>
  );
};

export default SpotlightFeature;