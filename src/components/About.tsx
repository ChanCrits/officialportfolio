import React from 'react';
import AnimatedText from './AnimatedText';
import { IconCloud } from './IconCloud';

const About: React.FC = () => {
  // Technology icons for the cloud
  const techIcons = [
    'react',
    'typescript',
    'javascript',
    'html5',
    'css3',
    'tailwindcss',
    'nodejs',
    'php',
    'laravel',
    'mysql',
    'adobeillustrator',
    'adobephotoshop',
    'git',
    'github',
    'vscode'
  ];

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8">
        {/* About Content */}
        <div className="w-full md:w-1/2 max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-0 overflow-hidden">
          {/* Command prompt style title bar */}
          <div className="flex items-center bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 mr-4"></span>
            <span className="text-gray-300 font-mono text-base">About Me — cmd.exe</span>
          </div>
          {/* Command prompt content */}
          <div className="px-6 py-8 bg-gray-900">
            <span className="text-green-400 font-mono text-xl">C:\Users\Christian&gt; </span>
            <AnimatedText
              text={"Hello! I'm Christian Earl Siong, a passionate Graphic Designer and Web Developer. I love creating beautiful and functional digital experiences. This page is a placeholder for more information about me, my journey, and my skills. Former Information Technology Head Graphics Designer."}
              className="text-2xl text-gray-100 font-mono"
            />
          </div>
        </div>
        {/* Technology Icon Cloud */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <IconCloud iconSlugs={techIcons} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default About; 