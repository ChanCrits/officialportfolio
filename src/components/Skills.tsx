import React from 'react';

interface Skill {
  name: string;
  percentage: number;
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    { name: 'Photoshop', percentage: 50 },
    { name: 'Illustrator', percentage: 50 },
    { name: 'React.Js', percentage: 50 },
    { name: 'Laravel', percentage: 50 },
    { name: 'CSS', percentage: 50 },
    { name: 'HTML', percentage: 50 },
  ];

  return (
    <div className="w-full max-w-4xl p-2 sm:p-4">
      <h2 className="text-xl font-light mb-4 sm:mb-6 text-gray-300">Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative size-20 sm:size-24">
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
                  strokeDasharray={`${skill.percentage * 0.75} 100`} 
                  strokeLinecap="round"
                />
              </svg>
              {/* Value Text */}
              <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-bold text-blue-600">{skill.percentage}</span>
                <span className="text-blue-600 block text-sm">%</span>
              </div>
            </div>
            <span className="mt-2 text-sm text-gray-400">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills; 