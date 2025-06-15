import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimatedText from './components/AnimatedText';
import Skills from './components/Skills';

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background Logo Overlay */}
      <img
        src="/cs logo.png"
        alt="CS Logo Background"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 max-w-xl opacity-10 z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow relative flex flex-col items-center justify-center px-4">
          {/* Text section - positioned on the left */}
          <div className="absolute left-[2%] md:left-[5%] text-3xl md:text-5xl font-bold space-y-3">
            <div className="max-w-[90vw] md:max-w-[600px]">
              <h1>Hi, I'm</h1>
              <h1 className="text-blue-400">Christian Earl Siong</h1>
            </div>
            <div className="text-2xl md:text-3xl font-normal text-gray-300 max-w-[90vw] md:max-w-[600px]">
              <AnimatedText text="Graphic Designer, Web Developer" className="text-blue-400" />
            </div>
            <div className="text-sm md:text-base font-normal tracking-wider uppercase text-gray-400 max-w-[90vw] md:max-w-[600px]">
              Bachelor of Science in Information Technology
            </div>
          </div>
          {/* Profile image - responsive sizing */}
          <img
            src="/profile.png"
            alt="Profile"
            className="w-4/5 md:w-1/2 max-w-md object-cover shadow-lg fade-bottom"
            draggable={false}
          />
          {/* Skills section - positioned on the right */}
          <div className="absolute right-[2%] md:right-[5%] top-1/2 -translate-y-1/2">
            <Skills />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
