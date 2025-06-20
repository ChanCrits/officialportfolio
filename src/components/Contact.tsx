import React from 'react';
import AnimatedText from './AnimatedText';

const Contact: React.FC = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-0 overflow-hidden">
        {/* Command prompt style title bar */}
        <div className="flex items-center bg-gray-800 px-4 py-2 border-b border-gray-700">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 mr-4"></span>
          <span className="text-gray-300 font-mono text-base">Contact — cmd.exe</span>
        </div>
        {/* Command prompt content */}
        <div className="px-6 py-8 bg-gray-900">
          <span className="text-green-400 font-mono text-xl">C:\Users\Christian&gt; </span>
          <AnimatedText
            text={"Feel free to reach out for collaborations, project inquiries, or just to say hello!"}
            className="text-2xl text-gray-100 font-mono"
          />
          <div className="mt-8 space-y-4 text-gray-200 font-mono text-lg">
            <div>
              <span className="font-semibold text-blue-400">Email:</span> christianearlsiong@gmail.com
            </div>
            <div>
              <span className="font-semibold text-blue-400">Phone:</span> +63 9695935921
            </div>
            <div>
              <span className="font-semibold text-blue-400">Location:</span> Tubigon, Sibulan Negros Oriental
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact; 