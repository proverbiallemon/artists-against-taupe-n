import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    // Only add listener when menu is open
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside as EventListener);
      document.addEventListener('touchstart', handleClickOutside as EventListener);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <header ref={headerRef} className="bg-gray-800 bg-opacity-80 backdrop-blur-lg p-5 fixed w-full z-50 transition-colors duration-300">
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
          <Link to="/" className={`text-white hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
          <Link to="/about" className={`text-white hover:text-primary ${location.pathname === '/about' ? 'text-primary' : ''}`}>About</Link>
          <Link to="/artists" className={`text-white hover:text-primary ${location.pathname === '/artists' ? 'text-primary' : ''}`}>Artists</Link>
          <Link to="/galleries" className={`text-white hover:text-primary ${location.pathname.startsWith('/galleries') ? 'text-primary' : ''}`}>Galleries</Link>
          <Link to="/partners" className={`text-white hover:text-primary ${location.pathname === '/partners' ? 'text-primary' : ''}`}>Partners</Link>
          <Link to="/contact" className={`text-white hover:text-primary ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
        </nav>
      </div>

      {/* Mobile nav that shows on small screens */}
      <nav
        className={`flex flex-col items-start gap-4 p-5 bg-gray-800 bg-opacity-90 absolute top-full left-0 w-full shadow-lg transition-all duration-300 md:hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <Link to="/" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
        <Link to="/about" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname === '/about' ? 'text-primary' : ''}`}>About</Link>
        <Link to="/artists" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname === '/artists' ? 'text-primary' : ''}`}>Artists</Link>
        <Link to="/galleries" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname.startsWith('/galleries') ? 'text-primary' : ''}`}>Galleries</Link>
        <Link to="/partners" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname === '/partners' ? 'text-primary' : ''}`}>Partners</Link>
        <Link to="/contact" onClick={closeMenu} className={`text-white hover:text-primary ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
      </nav>
    </header>
    </>
  );
};

export default Header;
