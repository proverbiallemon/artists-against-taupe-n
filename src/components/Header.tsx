import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 bg-opacity-80 backdrop-blur-lg p-5 fixed w-full z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl font-fredoka text-primary hover:text-secondary">Artists Against Taupe</Link>
        
        {/* Hamburger menu only visible on small screens */}
        <button
          onClick={toggleMenu}
          className="p-2 w-10 h-10 flex items-center justify-center cursor-pointer ml-auto md:hidden"
          aria-label="Toggle Menu"
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''} bg-white w-6 h-0.5 relative`}>
            <div
              className={`hamburger-line ${menuOpen ? 'rotate-45' : ''} absolute top-[-6px] left-0 w-6 h-0.5 bg-white transition-transform`}
            ></div>
            <div
              className={`hamburger-line ${menuOpen ? '-rotate-45' : ''} absolute top-[6px] left-0 w-6 h-0.5 bg-white transition-transform`}
            ></div>
          </div>
        </button>

        {/* Full nav visible on larger screens */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/galleries" className="text-white hover:text-primary">Galleries</Link>
          {isHomePage && (
            <>
              <a href="#what" className="text-white hover:text-primary">Beyond Beige</a>
              <a href="#spotlight" className="text-white hover:text-primary">Spotlight</a>
              <a href="#credo" className="text-white hover:text-primary">Credo</a>
              <a href="#revolutionaries" className="text-white hover:text-primary">Revolutionaries</a>
              <a href="#partners" className="text-white hover:text-primary">Partners</a>
              <a href="#contact" className="text-white hover:text-primary">Join the Movement</a>
            </>
          )}
        </nav>
      </div>

      {/* Mobile nav that shows on small screens */}
      <nav
        className={`flex flex-col items-start gap-4 p-5 bg-gray-800 bg-opacity-90 absolute top-full left-0 w-full shadow-lg transition-all duration-300 md:hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <Link to="/galleries" onClick={closeMenu} className="text-white hover:text-primary">Galleries</Link>
        {isHomePage && (
          <>
            <a href="#what" onClick={closeMenu} className="text-white hover:text-primary">Beyond Beige</a>
            <a href="#spotlight" onClick={closeMenu} className="text-white hover:text-primary">Spotlight</a>
            <a href="#credo" onClick={closeMenu} className="text-white hover:text-primary">Credo</a>
            <a href="#revolutionaries" onClick={closeMenu} className="text-white hover:text-primary">Revolutionaries</a>
            <a href="#partners" onClick={closeMenu} className="text-white hover:text-primary">Partners</a>
            <a href="#contact" onClick={closeMenu} className="text-white hover:text-primary">Join the Movement</a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
