import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="my-4 backdrop-blur-glass bg-glass border border-white/10 rounded-lg shadow-lg">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-3">
              <img src="/cs logo.png" alt="CS Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold tracking-wider">CS Portfolio</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="hover:text-gray-300 transition-colors">Home</a>
              <a href="#about" className="hover:text-gray-300 transition-colors">About</a>
              <a href="#projects" className="hover:text-gray-300 transition-colors">Projects</a>
              <a href="#contact" className="hover:text-gray-300 transition-colors">Contact</a>
            </nav>
            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 