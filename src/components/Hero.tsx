import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-screen-lg mx-auto px-5 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
          Artists Against Taupe
        </h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl max-w-4xl mx-auto mb-8">
          <p className="text-2xl md:text-3xl text-gray-800 font-bold leading-tight">
            Transforming institutional spaces through vibrant murals and artwork. 
            Bringing color, joy, and hope to communities across Louisville and beyond.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/galleries" 
            className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Explore Our Work
          </Link>
          <Link 
            to="/contact" 
            className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Join the Movement
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;