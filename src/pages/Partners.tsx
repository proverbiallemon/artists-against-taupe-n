import React from 'react';

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-screen-lg mx-auto p-5">
        <h1 className="text-5xl font-bold text-primary mb-8">Our Partners</h1>
        
        <div className="bg-gray-100 rounded-lg shadow-lg p-8">
          <p className="text-xl mb-8 text-gray-800 font-bold">
            Our incredible partners who support the movement and help us transform institutional 
            spaces into vibrant, healing environments.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">Community Organizations</h2>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.ymcalouisville.org/programs/community/safe-place-services" 
                     className="text-blue-500 hover:text-blue-700 font-bold text-lg">
                    YMCA Safe Place Services
                  </a>
                  <p className="text-gray-600 ml-4">
                    Providing shelter and support for homeless and at-risk youth
                  </p>
                </li>
                <li>
                  <a href="https://louisvilleunfair.org/" 
                     className="text-blue-500 hover:text-blue-700 font-bold text-lg">
                    Louisville UnFair
                  </a>
                  <p className="text-gray-600 ml-4">
                    Supporting local artists and creative communities
                  </p>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">Creative Partners</h2>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.prestonartscenter.com/" 
                     className="text-blue-500 hover:text-blue-700 font-bold text-lg">
                    Preston Art Supply
                  </a>
                  <p className="text-gray-600 ml-4">
                    Providing materials for our artistic transformations
                  </p>
                </li>
                <li>
                  <a href="http://flamerun.com" 
                     className="text-blue-500 hover:text-blue-700 font-bold text-lg">
                    Flame Run Glass Studio
                  </a>
                  <p className="text-gray-600 ml-4">
                    Where the Artists Against Taupe journey began
                  </p>
                </li>
                <li>
                  <a href="https://www.heritageprintshop.com/" 
                     className="text-blue-500 hover:text-blue-700 font-bold text-lg">
                    Heritage Print Shop
                  </a>
                  <p className="text-gray-600 ml-4">
                    Supporting our print and design needs
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">Supporting Businesses</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <li>
                <a href="http://squishable.com" 
                   className="text-blue-500 hover:text-blue-700 font-bold">
                  Squishable.com
                </a>
              </li>
              <li>
                <a href="https://www.generalrubberplastics.com/" 
                   className="text-blue-500 hover:text-blue-700 font-bold">
                  General Rubber and Plastics
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/badcatboutique/?hl=en" 
                   className="text-blue-500 hover:text-blue-700 font-bold">
                  Bad Cat Boutique
                </a>
              </li>
              <li>
                <a href="https://www.tattoosalvation.com" 
                   className="text-blue-500 hover:text-blue-700 font-bold">
                  Tattoo Salvation
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mt-12 p-6 bg-primary/10 rounded-lg">
            <h3 className="text-xl font-bold text-primary mb-4">Become a Partner</h3>
            <p className="text-gray-700 mb-4">
              Interested in supporting the Artists Against Taupe movement? We're always looking 
              for partners who share our vision of transforming institutional spaces.
            </p>
            <a href="/contact" 
               className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;