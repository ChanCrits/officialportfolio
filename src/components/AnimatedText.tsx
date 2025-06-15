import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 0, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Speed of typing

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={`inline-block ${className}`}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};

export default AnimatedText; 