import React from 'react';
import { Link } from 'react-router-dom';
import VideoHero from './VideoHero';

const Hero: React.FC = () => {
  return (
    <>
      <VideoHero className="h-screen">
        <div className="h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="max-w-screen-lg mx-auto px-5 text-center">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white/60 drop-shadow-lg">
                <span className="block">Artists Against</span>
                <span className="block">Taupe</span>
              </h1>
            </div>
          </div>
          
          <div className="w-full bg-black/30 backdrop-blur-sm pt-6 pb-12 sm:py-8">
            <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center">
              <Link 
                to="/galleries" 
                className="bg-primary text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Our Work
              </Link>
              <Link 
                to="/contact" 
                className="bg-primary text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                Join the Movement
              </Link>
            </div>
          </div>
        </div>
      </VideoHero>
      
      <div className="max-w-screen-lg mx-auto px-5 text-center mt-6 mb-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl text-gray-800 font-bold leading-tight">
            Transforming institutional spaces through vibrant murals and artwork. 
            Bringing color, joy, and hope to communities across Louisville and beyond.
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;