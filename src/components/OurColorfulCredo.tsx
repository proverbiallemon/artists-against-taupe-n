import React from 'react';
import Slideshow from './Slideshow'; // Ensure this path is correct based on your file structure

const images = [
  '/images/carousel2/Car2.1.webp',
  '/images/carousel2/Car2.2.webp',
  '/images/carousel2/Car2.3.webp',
  '/images/carousel2/Car2.4.webp',
  '/images/carousel2/Car2.5.webp',
];

const OurColorfulCredo: React.FC = () => {
  return (
    <section id="credo" className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-fredoka font-bold text-primary mb-6">Credo</h2>
        <p className="text-lg font-fredoka font-bold mb-4">Witnessing the care of Safe Place Services, I was inspired to contribute with art, community, and color. I envisioned the kind of space that doesn't remind you that you need help.  I wanted to change the look of help.  I wanted to create a space that also allows your brain to rest, escape, decompress, and inspire.</p>
        <p className="text-lg font-bold mb-8">Life is hard.  The only thing we all have in common is that each of us used to be a baby, and babies love color, sound, and movement. It's impossible to feel joy when your most basic needs aren't met, so the opportunity that Safe Place offers for youth, the certainty that their needs are met and they are safe, also gives the opportunity for a bit of mental rest and decompression.  I've never found peace in an institutional looking environment, so I wanted to change things.</p>

        {/* Slideshow Component */}
        <Slideshow images={images} />
      </div>
    </section>
  );
}

export default OurColorfulCredo;
