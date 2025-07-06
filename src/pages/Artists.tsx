import React from 'react';
import Slideshow from '../components/Slideshow';
import { getImageUrl } from '../utils/imageUtils';

const crewImage = getImageUrl('/images/thecrew/crew.webp');

const revolutionaryImages = [
  '/images/carousel3/Car3.1.webp',
  '/images/carousel3/Car3.2.webp',
  '/images/carousel3/Car3.3.webp',
  '/images/carousel3/Car3.4.webp',
  '/images/carousel3/Car3.5.webp',
];

const Artists: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-7xl mx-auto p-5">
        <h1 className="text-5xl font-bold text-primary mb-8">Featured Artists</h1>

        {/* Spotlight Artists Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-8">Artist Spotlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Tiffany Ackerman Spotlight */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-4">Tiffany Ackerman</h3>
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
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-4">Aril Ferrara</h3>
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

          {/* Hannah Fitzgerald Spotlight - Full Width */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">Hannah Fitzgerald</h3>
            <p className="mb-4 font-bold text-gray-700">
              The YMCA for greater Louisville 2024 Safe Place services volunteer of the year for her tireless dedication the <a href="https://www.instagram.com/explore/tags/safeplacewalls/" className="text-blue-500 hover:text-blue-700">#SafePlaceWalls</a> initiative.
            </p>
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

        {/* Revolutionaries Section */}
        <section className="bg-gray-100 rounded-lg shadow-lg p-8 text-gray-800">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-fredoka font-bold text-primary mb-6">The Revolutionaries</h2>
              <p className="text-lg font-bold mb-6 text-gray-800">
                35 artists and growing: 
                <a href="https://www.tartackerart.com/" className="text-blue-500 hover:text-blue-700"> Tiffany Ackerman</a>, 
                <a href="https://www.instagram.com/beysco/?hl=en" className="text-blue-500 hover:text-blue-700"> Jackie Almanza</a>, 
                <a href="https://www.hannahfitz.com/" className="text-blue-500 hover:text-blue-700"> Hannah Fitzgerald</a>, 
                Oliver Penna, 
                Lily Westfall, 
                Amanda Boals, 
                Matthew Gotth-Olsen, 
                Virginia Gotth-Olsen, 
                <a href="https://www.instagram.com/icequeenalchemy/" className="text-blue-500 hover:text-blue-700"> Jamie Ice</a>, 
                <a href="https://linktr.ee/iamryancase" className="text-blue-500 hover:text-blue-700"> Ryan Case</a>, 
                <a href="https://www.instagram.com/whitbird/" className="text-blue-500 hover:text-blue-700"> Whitney Arnold</a>, 
                <a href="https://www.whitneyolsen.com/" className="text-blue-500 hover:text-blue-700"> Whitney Olsen</a>, 
                Elizabeth Blandford, 
                <a href="https://www.instagram.com/harildkylerarts/" className="text-blue-500 hover:text-blue-700"> Aril Ferrara</a>, 
                Bricce Ferrara, 
                <a href="https://www.instagram.com/alexsublett_tattoo/?hl=en" className="text-blue-500 hover:text-blue-700"> Alex Sublett</a>, 
                <a href="https://www.instagram.com/parchmentpossum/?hl=en" className="text-blue-500 hover:text-blue-700"> Sydney Givens</a>, 
                Karen Axmaker, 
                Sir Panda, 
                <a href="https://www.instagram.com/parchmentpossum/?hl=en" className="text-blue-500 hover:text-blue-700"> Kayla Lewis</a>, 
                <a href="https://www.instagram.com/scott_shuffitt/" className="text-blue-500 hover:text-blue-700"> Scott Shuffit</a>, 
                <a href="https://tattoosalvation.com/?gad_source=1&gclid=Cj0KCQjw_sq2BhCUARIsAIVqmQvQ7FfxtqLBvd8B3DbqK0IJ8cFzP0kqJnB4cmHBPm6JoAdvzmf6xcMaAm14EALw_wcB" className="text-blue-500 hover:text-blue-700"> Adam Potts</a>, 
                <a href="https://palemoontattoo.com/" className="text-blue-500 hover:text-blue-700"> Ryan Rumsey</a>, 
                <a href="https://www.instagram.com/alexrumseyart/?hl=en" className="text-blue-500 hover:text-blue-700"> Alex Rumsey</a>, 
                Meagan Honnaker, 
                <a href="https://www.instagram.com/dirtyhandstudios/?hl=en" className="text-blue-500 hover:text-blue-700"> Dirty Hands Studios</a>, 
                <a href="https://www.instagram.com/harildkylerarts/" className="text-blue-500 hover:text-blue-700"> Harild Kyler Arts</a>, 
                <a href="https://www.instagram.com/brittania25/?hl=en" className="text-blue-500 hover:text-blue-700"> Bonnie Westfield</a>, 
                <a href="https://www.instagram.com/inkydragon/?hl=en" className="text-blue-500 hover:text-blue-700"> Sarah Tidwell</a>, 
                <a href="https://www.instagram.com/officialtonevallejo/?hl=en" className="text-blue-500 hover:text-blue-700"> Tone Vallejo</a>, 
                <a href="https://www.instagram.com/jem_doesart/?hl=en" className="text-blue-500 hover:text-blue-700"> JEM</a>, 
                <a href="https://www.instagram.com/drewby9000/?hl=en" className="text-blue-500 hover:text-blue-700"> Andrew Preston</a>, 
                <a href="https://www.instagram.com/damonpaints/?hl=en" className="text-blue-500 hover:text-blue-700"> Damon Thompson</a>, 
                <a href="https://www.instagram.com/moxi.creativelab/" className="text-blue-500 hover:text-blue-700"> Moxxi</a>, 
                Christina Gutowski, 
                <a href="https://louisvilleunfair.org/" className="text-blue-500 hover:text-blue-700"> Louisville Unfair</a>, 
                <a href="https://www.instagram.com/heavyvellum/" className="text-blue-500 hover:text-blue-700"> Heavy Vellum</a>, 
                <a href="https://www.instagram.com/corey_herbert87/" className="text-blue-500 hover:text-blue-700"> Corey Muffin Armstrong</a>,
                Eric Niederstadt,
                <a href="https://www.instagram.com/pocket_bear_official" className="text-blue-500 hover:text-blue-700"> Pocket Bear</a>
              </p>

              <Slideshow images={revolutionaryImages} />
            </div>
            
            <div className="md:w-1/3">
              <img src={crewImage} alt="The crew" className="rounded-lg shadow-lg w-full" />
              <p className="mt-2 font-bold text-center">three bad sqwarls</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Artists;