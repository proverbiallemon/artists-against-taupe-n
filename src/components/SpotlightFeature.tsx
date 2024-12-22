import React from 'react';

const SpotlightFeature: React.FC = () => {
  return (
    <section id="spotlight" className="scroll-mt-20 max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tiffany Ackerman Spotlight */}
        <div className="bg-gray-100 rounded-lg p-6 shadow-md text-center">
          <h3 className="text-4xl font-bold text-primary mb-4">Spotlight on Tiffany</h3>
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
            Read Tiffany's Story
          </a>
        </div>

        {/* Aril Ferrara Spotlight */}
        <div className="bg-gray-100 rounded-lg p-6 shadow-md text-center">
          <h3 className="text-4xl font-bold text-primary mb-4">Spotlight on Aril Ferrara</h3>
          <p className="mb-4 font-bold text-gray-700">
            Aril Ferrara's journey is one of resilience and creativity. Despite facing a Stage 4 cancer diagnosis at just 25, Aril has used her art to inspire others and bring joy to her community. She volunteers regularly, painting murals and working with children, while continuing to create meaningful art.
          </p>
          <a
            href="https://uoflhealth.org/aril/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
          >
            Read Aril's Story
          </a>
        </div>
      </div>

      {/* Hannah Fitzgerald Spotlight */}
      <div className="bg-gray-100 rounded-lg p-6 shadow-md text-center mt-8 md:col-span-2">
        <h3 className="text-4xl font-bold text-primary mb-4">Spotlight on Hannah Fitzgerald</h3>
        <p className="mb-4 font-bold text-gray-700">
          The YMCA for greater Louisville 2024 Safe Place services volunteer of the year for her tireless dedication the <a href="https://www.instagram.com/explore/tags/safeplacewalls/" className="text-blue-500 hover:text-blue-700">#SafePlaceWalls</a>  initiative.</p>
        <a
          href="https://perfectscoreglass.bigcartel.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
        >
          Explore Hannah's Work
        </a>
      </div>
    </section>
  );
};

export default SpotlightFeature;
