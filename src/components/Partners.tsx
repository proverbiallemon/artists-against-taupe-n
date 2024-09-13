import React from 'react';

const Resources: React.FC = () => {
  return (
    <section id="partners" className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 my-8 text-gray-800">
      <div>
        <h2 className="text-4xl font-bold text-primary mb-6">Partners</h2>
        <p className="mb-4 font-bold">Our incredible partners who support the movement:</p>
        <ul className="list-disc ml-6 space-y-2 font-bold">
          <li><a href="https://www.ymcalouisville.org/programs/community/safe-place-services" className="text-blue-500  hover:text-blue-700">YMCA Safe Place Services</a></li>
          <li><a href="https://louisvilleunfair.org/" className="text-blue-500  hover:text-blue-700">Louisville UnFair</a></li>
          <li><a href="https://www.prestonartscenter.com/" className="text-blue-500  hover:text-blue-700">Preston Art Supply</a></li>
          <li><a href="http://flamerun.com" className="text-blue-500  hover:text-blue-700">Flame Run Glass Studio</a></li>
          <li><a href="http://squishables.com" className="text-blue-500  hover:text-blue-700">Squishables.com</a></li>
          <li><a href="https://www.heritageprintshop.com/" className="text-blue-500  hover:text-blue-700">Heritage Print Shop</a></li>
          <li><a href="https://www.generalrubberplastics.com/" className="text-blue-500  hover:text-blue-700">General Rubber and Plastics</a></li>
          <li><a href="https://www.instagram.com/badcatboutique/?hl=en" className="text-blue-500  hover:text-blue-700">Bad Cat Boutique</a></li>
          <li><a href="https://www.tattoosalvation.com" className="text-blue-500  hover:text-blue-700">Tattoo Salvation</a></li>
        </ul>
      </div>
    </section>
  );
}

export default Resources;
