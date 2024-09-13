import React from 'react';
import Slideshow from './Slideshow';

const images = [
  '/images/carousel1/Car1.1.webp',
  '/images/carousel1/Car1.2.webp',
  '/images/carousel1/Car1.3.webp',
  '/images/carousel1/Car1.4.webp',
  '/images/carousel1/Car1.5.webp',
  '/images/carousel1/Car1.6.webp',
];

const WhatWeStandFor: React.FC = () => {
  return (
    <section id="what" className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <div>
        <h2 className="text-4xl font-bold text-primary mb-6">Beyond Beige</h2>
        <p className="mb-4 font-bold">
          I am an artist, educator, and curator, in Louisville, KY. In 2011, my life took a transformative turn when I crossed paths at <a href="http://www.flamerun.com" className="text-blue-500 hover:text-blue-700"> Flame Run Glass Studio</a> with Nick Brown, a dedicated youth worker at the <a href="https://www.ymcalouisville.org/programs/community/safe-place-services" className="text-blue-500 hover:text-blue-700">YMCA Safe Place</a>, which caters to homeless and at-risk youth. Every Tuesday night since, I have been teaching art classes at Safe Place to the shelter house youth, unaware of the impact it would have on my own life.
        </p>
        <p className="mb-4 font-bold">
          Safe Place is unlike any other shelter available for at-risk youth. 
        <img src="/images/mause/502mause.webp" alt="502 Mause" className="mause-image float-right ml-4 mb-4 w-64 h-auto rounded shadow" /> The youth will be the first ones to tell you that it feels different, and I hear often that most of the youth like it the best of any place they have ever been. The more I thought about it, the more I realized the youth deserve better. I have never been in a position where taupe or beige walls have made me feel better. I also realized that most of our clients are already institutionalized, spending most of their time moving from facility to facility, and it didn't help them. Safe Place is dedicated to safety, shelter, and support. The number one goal is family unification, and strengthening the family as a whole when possible.
        </p>
        <p className="mb-4 font-bold">
         My vision was to change the look of help. And so, my <a href="https://www.instagram.com/explore/tags/safeplacewalls/" className="text-blue-500 hover:text-blue-700">#safeplacewalls</a>, <a href="https://www.instagram.com/explore/tags/artistsagainsttaupe/">#artistsagainsttaupe</a> journey began.
        </p>
        <p className="mb-4 font-bold">
          This <a href="https://www.instagram.com/explore/tags/safeplacewalls/" className="text-blue-500 hover:text-blue-700">#SafePlaceWalls</a> initiative has become a labor of love, as artists from various backgrounds, both professional and inexperienced, joined forces to contribute their unique artistic voices. Together, we are painting murals, creating installations, and crafting an experience, a campus that is as unique to the clients who pass through, and the incredible staff of humans who work there. This project began officially in September of 2022, and we have completely transformed the Shelter House, emergency shelter for homeless and at risk youth, and have banished the institutional walls with murals on every wall and in every room.
          </p>
        <p className="mb-4 font-bold">
          I also created and installed my most complicated artwork thus far, the "Mumplequarium". The old empty 50-gallon fish tank in the Shelter House has now been transformed into a moving LED foam and plastic zero-maintenance therapy tank. It is filled with Mumples, my imaginary friends, glowing butterflies, snails, and with fans to blow things around and animated LED lights that flicker and sparkle.
        </p>

        {/* Slideshow Component */}
        <Slideshow images={images} />
      </div>
    </section>
  );
}

export default WhatWeStandFor;
