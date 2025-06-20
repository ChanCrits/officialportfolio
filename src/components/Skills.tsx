import React, { useEffect, useState } from 'react';

interface Skill {
  name: string;
  percentage: number;
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    { name: 'Photoshop', percentage: 60 },
    { name: 'Illustrator', percentage: 50 },
    { name: 'React.Js', percentage: 40 },
    { name: 'Laravel', percentage: 50 },
    { name: 'CSS', percentage: 50 },
    { name: 'HTML', percentage: 50 },
  ];

  // Animated percentages state
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>(skills.map(() => 0));

  useEffect(() => {
    const durations = 1200; // ms
    const steps = 60;
    const interval = durations / steps;
    let currentStep = 0;
    const increments = skills.map(skill => skill.percentage / steps);

    const anim = setInterval(() => {
      currentStep++;
      setAnimatedPercentages(prev =>
        prev.map((val, i) => {
          const next = val + increments[i];
          return next > skills[i].percentage ? skills[i].percentage : next;
        })
      );
      if (currentStep >= steps) clearInterval(anim);
    }, interval);
    return () => clearInterval(anim);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 md:mb-6 text-gray-300 text-center sm:text-left">Skills</h2>
      <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle (Gauge) */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-current text-gray-200" 
                  strokeWidth="1.5" 
                  strokeDasharray="75 100" 
                  strokeLinecap="round"
                />
                {/* Gauge Progress */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-current text-blue-600" 
                  strokeWidth="1.5" 
                  strokeDasharray={`${animatedPercentages[index] * 0.75} 100`} 
                  strokeLinecap="round"
                />
              </svg>
              {/* Value Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{Math.round(animatedPercentages[index])}</span>
                <span className="text-blue-600 block text-xs sm:text-sm md:text-base">%</span>
              </div>
            </div>
            <span className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-400 font-medium">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills; 