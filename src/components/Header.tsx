import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="my-4 backdrop-blur-glass bg-glass border border-white/10 rounded-lg shadow-lg">
          <div className="flex items-center justify-between h-16 px-6">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/cs logo.png" alt="CS Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold tracking-wider">CS Portfolio</span>
            </Link>
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
              <Link to="/projects" className="hover:text-gray-300 transition-colors">Projects</Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            </nav>
            {/* Hamburger Button */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile Nav */}
          {menuOpen && (
            <nav className="md:hidden flex flex-col space-y-2 px-6 pb-4 animate-fade-in">
              <Link to="/" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/about" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/projects" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>Projects</Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>Contact</Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 