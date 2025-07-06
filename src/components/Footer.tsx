import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Artists Against Taupe</h3>
            <p className="text-gray-300">
              Transforming institutional spaces through vibrant murals and artwork. 
              Bringing color, joy, and hope to communities across Louisville and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-gray-300 hover:text-primary transition-colors">
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link to="/galleries" className="text-gray-300 hover:text-primary transition-colors">
                  Art Takeovers
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-primary transition-colors">
                  Our Partners
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Join the Movement
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Get In Touch</h3>
            <p className="text-gray-300 mb-2">Louisville, KY</p>
            <Link 
              to="/contact" 
              className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition mt-4"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Artists Against Taupe. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-gray-300 hover:text-primary transition-colors"
            aria-label="Back to top"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;