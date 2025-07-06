import React from 'react';
import Slideshow from './Slideshow';
import { getImageUrl } from '../utils/imageUtils';

const crewImage = getImageUrl('/images/thecrew/crew.webp');

const images = [
  '/images/carousel3/Car3.1.webp',
  '/images/carousel3/Car3.2.webp',
  '/images/carousel3/Car3.3.webp',
  '/images/carousel3/Car3.4.webp',
  '/images/carousel3/Car3.5.webp',
];

const Revolutionaries: React.FC = () => {
  return (
    <section id="revolutionaries" className="scroll-mt-20 max-w-screen-lg mx-auto bg-gray-100 rounded-lg shadow-lg p-4 md:p-8 my-8 text-gray-800 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full">
        <div className="text-content space-y-4 md:col-span-2 min-w-0 overflow-hidden">
          <h2 className="text-4xl font-fredoka font-bold text-primary">The Revolutionaries</h2>
          <p className="text-lg font-bold break-words">
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

          {/* Slideshow Component */}
          <div className="w-full max-w-full overflow-hidden" style={{ maxWidth: '100%' }}>
            <div className="relative w-full">
              <Slideshow images={images} />
            </div>
          </div>
        </div>
        <div className="image-content md:col-span-1">
          <img src={crewImage} alt="The crew" className="rounded-lg shadow-lg w-full" />
          <p className="mt-2 font-bold text-center">three bad sqwarls</p>
        </div>
      </div>
    </section>
  );
}

export default Revolutionaries;
